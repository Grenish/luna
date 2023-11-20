import React, { useState, useRef, useEffect } from "react";
import {
  defaultlogo,
  send,
  logo,
  user,
  flac1,
  flac2,
  flac3,
  copy2,
  check,
} from "../assets";
import axios from "axios";

const CardComponent = ({ onCardClick }) => {
  const examples = [
    {
      heading: "Get Ideas",
      paragraph:
        "Can you come up with some names for a mocktail (non-alcoholic cocktail) with Coke and pomegranate syrup?",
    },
    {
      heading: "Code Snippet",
      paragraph:
        "Show me a code snippet of a website's sticky header in CSS and JavaScript.",
    },
    {
      heading: "Kid-Friendly Science",
      paragraph: "Help explain in a kid-friendly way why rainbows appear.",
    },
    {
      heading: "Language Learning",
      paragraph: "What is the best way to learn a new language?",
    },
    {
      heading: "Numpy 2D Array",
      paragraph: "How can I use numpy to create a 2D array?",
    },
    {
      heading: "Game Night",
      paragraph:
        "Help me plan a game night with 5 friends. I have dice and cards, but no board games. I would be willing to get board games for under $100.",
    },
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div id="cards" className="font-pop">
      {examples
        .slice(0, window.innerWidth < 768 ? 3 : examples.length)
        .map((item, index) => (
          <div
            className="card"
            key={index}
            onMouseMove={handleOnMouseMove}
            onClick={() => handleCardClick(item.paragraph)}
          >
            <h2 className="font-pop font-bold mb-2 text-gray-200">
              {item.heading}
            </h2>
            <p className="text-ash">{truncateText(item.paragraph, 30)}</p>
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
  const [copied, setCopied] = useState(false);
  const [context, setContext] = useState(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages are updated
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text, sender) => {
    const newMessage = { text, sender };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setLoading(true);
    setTextInput("");

    try {
      const response = await axios.post("https://luna-ibfx.onrender.com/", {
        userInput: text,
        context, // Send context with each request
      });

      const formattedText = response.data.candidates[0].content.replace(
        /\n/g,
        "<br />"
      );
      const processedText = renderCodeBlocks(formattedText);

      const textArray = processedText
        .map((element) => (element.props ? element.props.children : element))
        .join("");

      const lunaResponse = {
        text: textArray,
        sender: "luna",
      };

      setMessages((prevMessages) => [...prevMessages, lunaResponse]);
      setContext(response.data.context); // Update context based on Luna's response
    } catch (error) {
      console.error("Error:", error.message);
      const errorMessage = {
        text: "There is an error with the server. Please try again later.",
        sender: "luna",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleOnSubmit = async (e) => {
    if (e.key === "Enter" || (e.type === "click" && textInput.trim() !== "")) {
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

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 seconds
  };

 

  return (
    <div className=" bg-Lig sm:p-3 p-0 backPattern w-full h-screen flex justify-center overflow-hidden items-center relative">
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div
        className="w-full h-full bg-[#21251f8c] sm:rounded-xl rounded-none relative backdrop-blur-sm overflow-y-auto"
        ref={chatContainerRef}
      >
        {/* <div className="w-full h-full z-1 backPattern absolute"></div> */}
        {/* Intro */}

        <div className="w-full flex flex-col justify-center items-center">
          <img
            src={defaultlogo}
            alt=""
            className="w-[150px] mt-3 pointer-events-none"
          />
          <span className="font-pop text-ash">Your AI powered chatbot</span>

          <div className="mt-5 flex w-full flex-col justify-center items-center">
            <span className="font-pop font-black text-ash text-xl text-center">
              Some Examples Of What I Am Capable Of
            </span>
            <div id="cards">
              <CardComponent onCardClick={handleCardClick} />
            </div>
          </div>
        </div>

        {/* ChatBoxContent */}

        <div className="w-full flex flex-col  justify-center items-center mb-20 ">
          <div className="w-full flex flex-col justify-center items-center mt-5 sm:mb-2 mb-7">
            {/* Display User Messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className="w-full flex flex-col justify-center items-center p-2"
              >
                <div className="sm:w-[60%] w-[90%]">
                  <span className="flex items-center gap-1">
                    <img
                      src={message.sender === "user" ? user : logo}
                      alt={message.sender}
                      className={`pointer-events-none ${
                        message.sender === "user" ? "w-6 " : "w-5 mr-1 "
                      }`}
                    />
                    <span className="font-semibold pointer-events-none text-gray-200">
                      {message.sender === "user" ? "You" : "Luna"}
                    </span>
                  </span>

                  <div
                    className="ml-7 max-w-5xl font-pop text-sm text-ash"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.text),
                    }}
                  ></div>
                  {message.sender === "luna" && (
                    <div className="flex ml-6 justify-start items-center mt-1">
                      <button
                        className="text-xs font-pop text-ash p-1 "
                        onClick={() => handleCopyClick(message.text)}
                      >
                        <img
                          src={`${copied ? check : copy2}`}
                          alt=""
                          className="w-4 hover:scale-150 transition ease-in-out duration-200"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {loading && (
            <span className="loader"></span>
          )}
        </div>
      </div>

      {/* TextBox */}
      <form
        onSubmit={handleOnSubmit}
        className=" w-full fixed z-[999] bottom-0 p-5 flex flex-col items-center justify-center"
      >
        <div className="sm:w-[65%] w-[95%] mb-1">
          <button
            type="button"
            className="text-xs font-pop text-ash p-1 hover:bg-Gre hover:text-Lig transition duration-200 ease-in-out hover:border-bitter border-Blu border-2 rounded-lg bg-transparent backdrop-blur-sm"
            onClick={clearChat}
            disabled={loading}
          >
            + New
          </button>
        </div>
        <div className=" sm:w-2/3 w-full rounded-2xl bg-transparent backdrop-blur-sm border-2 border-Blu flex items-center">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="w-full p-3 placeholder-ash bg-transparent text-gray-200 rounded-l-2xl outline-none"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={loading}
            onKeyDown={handleOnSubmit}
          />

          <div className="p-2 bg-Gre rounded-xl mr-1 flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                handleOnSubmit(e);
              }}
            >
              <img src={send} alt="submit button" className="w-[20px]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MainContainer;
