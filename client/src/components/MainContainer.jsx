import React, { useState, useRef, useEffect } from "react";
import { defaultlogo, send, logo, user } from "../assets";
import axios from "axios";

const CardComponent = ({ onCardClick }) => {
  const example = [
    "Can you come up with some names for a mocktail (non-alcoholic cocktail) with Coke and pomegranate syrup?",
    "Show me a code snippet of a website's sticky header in CSS and JavaScript.",
    "Help explain in a kid-friendly way why rainbows appear",
    "What is the best way to learn a new language?",
    "How can I use numpy to create a 2D array?",
    "Help me plan a game night with 5 friends. I have dice and cards, but no board games. I would be willing to get board games for under $100",
  ];

  const handleCardClick = (text) => {
    onCardClick(text);
  };

  const handleOnMouseMove = (e) => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div id="cards" className="font-pop">
      {example.map((item, index) => (
        <div
          className="card"
          key={index}
          onMouseMove={handleOnMouseMove}
          onClick={() => handleCardClick(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const renderCodeBlocks = (text) => {
  // Regular expression to match code blocks between ```
  const codeBlockRegex = /```([\s\S]*?)```/g;

  return text.split(codeBlockRegex).map((part, index) => {
    // Even indices represent non-code text, odd indices represent code blocks
    if (index % 2 === 0) {
      // Replace newline characters with <br> for non-code text
      return part.replace(/\n/g, "<br>");
    } else {
      // Wrap code blocks in a pre tag for formatting
      return (
        <code key={index} className="code-block">
          {part}
        </code>
      );
    }
  });
};

const MainContainer = () => {
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are updated
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text, sender) => {
    const newMessage = { text, sender };
    setMessages((prevMessages) => {
      // console.log("Updating Messages with New Message:", [...prevMessages, messages]);
      return [...prevMessages, newMessage];
    });
    setLoading(true);
    
    setTextInput("");
    // Send the user's input to the server
    try {
      const response = await axios.post("https://luna-ibfx.onrender.com/", {
        userInput: text,
      });

      const formattedText = response.data.candidates[0].content.replace(
        /\n/g,
        "<br />"
      );
      const processedText = renderCodeBlocks(formattedText);

      const textString = processedText
        .map((element) => (element.props ? element.props.children : element))
        .join("");

      const lunaResponse = {
        text: textString,
        sender: "luna",
      };

      setMessages((prevMessages) => [...prevMessages, lunaResponse]);
    } catch (error) {
      console.error("Error:", error.message);
      const errorMessage = {
        text: "Sorry, I didn't quite get that. Please try again",
        sender: "luna",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async (e) => {
    if (e.key === "Enter" && textInput.trim() !== "") {
      e.preventDefault();
      await sendMessage(textInput, "user");
    }
  };

  
  const handleCardClick = (text) => {
    setTextInput(text);
  };

  const formatMessage = (text) => {
    // Replace * with numbering
    let numberedText = text.replace(
      /^\ * /gm,
      (match, index) => `${index + 1}.`
    );

    // Replace **word** with bold word
    let boldText = numberedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Replace *word* with italic word

    return boldText;
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className=" bg-primeBlack p-3 w-full h-screen flex justify-center items-center relative">
      <div
        className="w-full h-full bg-[#fdf0d592] rounded-xl relative backdrop-blur-xl overflow-y-auto"
        ref={chatContainerRef}
      >
        {/* Intro */}

        <div className="w-full flex flex-col justify-center items-center">
          <img
            src={defaultlogo}
            alt=""
            className="w-[150px] mt-3 pointer-events-none"
          />
          <span className="font-pop">Your AI powered chatbot</span>

          <div className="mt-5 flex w-full flex-col justify-center items-center">
            <span className="font-pop font-black text-primeBlack text-xl text-center">
              Some Examples Of What I Am Capable Of
            </span>
            <div id="cards">
              <CardComponent onCardClick={handleCardClick} />
            </div>
          </div>
        </div>

        {/* ChatBoxContent */}

        <div className="w-full flex flex-col justify-center items-center mt-5 mb-20">
          <div className="w-full flex flex-col justify-center items-center mt-5 mb-20">
            {/* Display User Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className="w-full flex flex-col justify-center items-center p-2"
              >
                <div className="w-[60%] ">
                  <span className="flex items-center gap-1">
                    <img
                      src={message.sender === "user" ? user : logo}
                      alt={message.sender}
                      className={`pointer-events-none ${
                        message.sender === "user" ? "w-6" : "w-5 mr-1"
                      }`}
                    />
                    <span className="font-semibold pointer-events-none">
                      {message.sender === "user" ? "You" : "Luna"}
                    </span>
                  </span>
                  <div
                    className="ml-7 max-w-5xl font-pop text-sm text-primeBlack"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.text),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {loading && (
            // Display loading animation if loading is true
            <div className="w-full flex justify-center items-center">
              <div className="border-t-4 border-van border-solid rounded-full animate-spin h-8 w-8"></div>
            </div>
          )}
        </div>
      </div>

      {/* TextBox */}
      <form
        onSubmit={handleOnSubmit}
        className=" w-full fixed z-[999] bottom-0 p-5 flex flex-col items-center justify-center"
      >
        <div className="w-[65%] mb-1">
          <button
            className="text-xs font-pop p-1 border-ash border-2 rounded-lg bg-transparent backdrop-blur-sm"
            onClick={clearChat}
            disabled={loading}
          >
            + New
          </button>
        </div>
        <div className=" w-2/3 rounded-2xl bg-transparent backdrop-blur-lg border-2 border-ash flex items-center">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full p-3 placeholder-primeBlack bg-transparent text-primeBlack rounded-l-2xl outline-none"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loading}
            onKeyDown={handleOnSubmit}
          />

          <div className="p-2 bg-pap rounded-xl mr-1 flex justify-center items-center">
            <button type="submit" disabled={loading}>
              <img src={send} alt="submit button" className="w-[20px]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MainContainer;
