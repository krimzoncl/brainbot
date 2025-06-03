// pages/index.js

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "¡Hola! ✉️ Soy tu asistente turístico. ¿A dónde quieres viajar en Chile? 🌍",
      from: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, from: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([...newMessages, { text: data.reply, from: "bot" }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#e5ddd5]">
      <div className="p-4 bg-[#075E54] text-white">
        <h1 className="text-lg font-bold">Hola, soy tu asistente turístico</h1>
        <p className="text-sm">
          Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-xl p-3 text-sm whitespace-pre-line ${
              msg.from === "bot"
                ? "bg-white self-start"
                : "bg-[#dcf8c6] self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-600">Escribiendo...</div>}
      </div>

      <div className="p-3 bg-[#f0f0f0] flex gap-2">
        <input
          className="flex-1 rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-[#25D366] text-white rounded-full px-4 py-2 text-sm font-semibold"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
