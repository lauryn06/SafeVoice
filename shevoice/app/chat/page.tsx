"use client";
import { AudioLines, Hand } from "lucide-react";
import { useState } from "react";
import "../globals.css";
import { Shield } from "lucide-react";
import { useEffect} from "react"
import path from "path";

export default function ChatPage() {
 const handleSafeExit = () => {
  window.location.replace("https://www.google.com");
};
const startVoiceRecognition = () => {

  const SpeechRecognition =
      (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {

    alert("Speech Recognition not supported");

    return;
  }
 

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = (event: any) => {

    const transcript =
      event.results[0][0].transcript;

    setInput(transcript);

  };

};

  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello 💜 I'm SheVoice AI. Are you safe right now?"
    }
  ]);

  const [input, setInput] = useState("");
  const [location, setLocation] = useState("Unknown");
  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        // Convert coordinates to city name using free API
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        const data = await res.json()
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "Unknown"

        setLocation(city)
        console.log("📍 Location detected:", city)
      },
      () => {
        setLocation("Unknown")
      }
    )
  }
}, [])

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
console.log(data.dangerLevel);

if(data.dangerLevel === "HIGH"){

  await fetch("/api/alert", {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      message: currentInput,

      location:location,

      dangerLevel:data.dangerLevel

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
<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      {/* HEADER */}

      <header className="chatHeader">
  <div className="logoSection">

          <div className="logoCircle">
            <Shield size={28} />

        </div>
          <h1>SheVoice AI</h1>
        
        </div>

        <button className="safeExit"
        onClick={handleSafeExit}>
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
<button
  className="micButton"
  onClick={startVoiceRecognition}
>
  <AudioLines size={18} />
</button>

<button onClick={sendMessage}>
  Send
</button>



      </section>

    </main>

  );
}