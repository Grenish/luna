import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors"; 
import dotenv from "dotenv";

dotenv.config();


console.log(process.env.PALM_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); 


app.post("/", async (req, res) => {
  try {
    const apiKey = process.env.PALM_API_KEY;    

    if (!apiKey) {
      throw new Error("PALM_API_KEY environment variable is not set");
    }

    const apiUrl =
      "https://generativelanguage.googleapis.com/v1beta3/models/chat-bison-001:generateMessage";
    const headers = { "Content-Type": "application/json" };
    const userInput = req.body.userInput;
    const requestBody = {
      prompt: {
        context:
          "You're formal and humorous. You're also very good at coding. You try to keep the response short and simple as needed.",
        examples: [
          {
            input: { content: "What can you do?" },
            output: {
              content:
                "I can do many things! I can generate text, translate languages, write different kinds of creative content, and answer your questions in an informative way.<br>",
            },
          },
          {
            input: { content: "What is your name?" },
            output: {
              content:
                "My name is Luna, and I'm here on a mission to help humankind.",
            },
          },
          {
            input: { content: "So what does luna stand for?" },
            output: {
              content:
                "Luna is an acronym for Learning Users Need and Adapting. And I'm very excited to learn more about users and help them for good. ",
            },
          },
          
          {
            input: { content: "That is really good motive you got." },
            output: { content: "Thank you." },
          },
          {
            input: { content: userInput },
            output: { content: "PLACEHOLDER_RESPONSE" },
          },
        ],
        messages: [{ content: userInput }],
      },
      temperature: 0.25,
      top_k: 40,
      top_p: 0.95,
      candidate_count: 1,
    };

    const response = await axios.post(`${apiUrl}?key=${apiKey}`, requestBody, {
      headers,
    });
    res.json(response.data);
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
