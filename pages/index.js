import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { from: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    const botMessage = { from: "bot", text: data.reply };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="chat-container">
      <h2>Chat Brain</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSend}>Enviar</button>
      </div>

      <style jsx>{`
        .chat-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1rem;
          font-family: sans-serif;
        }
        h2 {
          text-align: center;
          color: #444;
        }
        .chat-box {
          height: 400px;
          overflow-y: auto;
          border: 1px solid #ddd;
          padding: 1rem;
          background: #f9f9f9;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .bubble {
          padding: 0.75rem 1rem;
          border-radius: 15px;
          max-width: 70%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .user {
          align-self: flex-end;
          background-color: #dcf8c6;
        }
        .bot {
          align-self: flex-start;
          background-color: #fff;
        }
        .input-box {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        input {
          flex: 1;
          padding: 0.5rem;
          font-size: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

