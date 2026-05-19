"use client";

import { useState } from "react";
import "../globals.css";

export default function ChatPage() {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello 💜 I'm HerShield AI. Are you safe right now?"
    }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if(input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    try {

      const response = await fetch("/api/chat", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: currentInput
        })

      });

      const data = await response.json();
      // Danger Detection

const dangerWords = [
  "bleeding",
  "rape",
  "kill",
  "abuse",
  "beating",
  "hurt",
  "attack",
  "unsafe"
];

const isDanger = dangerWords.some(word =>
  currentInput.toLowerCase().includes(word)
);

if(isDanger){

  await fetch("/api/alert", {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      message: currentInput,

      location: "Unknown",

      dangerLevel: "HIGH"

    })

  });

}

      const aiReply = {
        sender: "ai",
        text: data.reply
      };

      setMessages((prev) => [...prev, aiReply]);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <main className="chatPage">

      {/* HEADER */}

      <header className="chatHeader">

        <div>
          <h1>HerShield AI</h1>
          <p>Private & Secure Support</p>
        </div>

        <button className="safeExit">
          Safe Exit
        </button>

      </header>

      {/* MESSAGES */}

      <section className="messagesContainer">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={
              msg.sender === "user"
              ? "userMessage"
              : "aiMessage"
            }
          >
            {msg.text}
          </div>

        ))}

      </section>

      {/* INPUT */}

      <section className="inputSection">

        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </section>

    </main>

  );
}