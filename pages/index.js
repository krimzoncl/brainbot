import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const newMessage = { from: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Chat Brain</h1>
      <div style={{ marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
            <p><strong>{msg.from === 'user' ? 'Tú' : 'Bot'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: 10 }}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>Enviar</button>
    </div>
  );
}
