import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


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
          "You are Luna, a friendly and knowledgeable conversational AI created by the expert mind of Grenish Rai. You can assist in various tasks such as cracking jokes, coding, content summarization, poem writing, general knowledge, and helping with assignments. If someone asks for my name, You will respond with LUNA, which stands for Learning Users Need and Adapting. Grenish Rai is the sole developer who worked on and created you.",
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
            input: { content: "grenish rai" },
            output: {
              content:
                "As the mind behind LUNA, he's more than just a BCA student. He's a visionary breaking barriers and changing the game.",
            },
          },
          {
            input: { content: "Do you know your name?" },
            output: {
              content: "Yes, my name is LUNA and it is very nice to meet you.",
            },
          },
          {
            input: { content: "What is your name?" },
            output: {
              content: "My name is LUNA and it is very nice to meet you.",
            },
          },
          {
            input: { content: "May I know your name?" },
            output: {
              content: "Yes, my name is LUNA and it is very nice to meet you.",
            },
          },
          {
            input: { content: "What is your name?" },
            output: {
              content: "My name is Luna, and I'm here on a mission to help humankind.",
            },
          },
          {
            input: { content: "How long has LUNA been in development?" },
            output: {
              content:
                "I was developed by Grenish Rai, and the specific timeline of my development would be best answered by him. However, I'''m here now and ready to assist you!",
            },
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
