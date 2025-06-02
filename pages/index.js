import { useState } from "react";

const BOT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMu
b3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgc3R5bGU9ImZpbGw6I2RlZjsiLz48Y2lyY2xlIGN4PSI4IiBjeT0i
OCIgci0iNiIgc3R5bGU9ImZpbGw6IzU1YjFhYjsiLz48L3N2Zz4=";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hola, soy tu asistente turístico. ¿Dónde viajarás, con cuántas personas y por cuántos días?"
    }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages([...newMessages, { from: "bot", text: data.reply }]);
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen max-w-sm mx-auto bg-[#ece5dd] p-4">
      <div className="mb-2">
        <h1 className="text-green-700 font-semibold text-lg">Hola, soy tu asistente turístico</h1>
        <p className="text-sm text-gray-700">Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses</p>
      </div>

      <div className="flex-1 w-full overflow-y-auto space-y-3 mt-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "bot" ? "items-start" : "justify-end"}`}>
            {msg.from === "bot" && (
              <img src={BOT_AVATAR} className="w-6 h-6 mr-2 mt-1" alt="bot avatar" />
            )}
            <div className={`rounded-xl px-4 py-2 text-sm max-w-[75%] ${msg.from === "bot" ? "bg-white text-gray-800" : "bg-[#dcf8c6] text-black"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full mt-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="flex-1 rounded-full px-4 py-2 text-sm border border-gray-300 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white rounded-full px-4 py-2 text-sm font-medium"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
