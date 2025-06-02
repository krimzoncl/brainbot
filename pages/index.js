import React, { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '¡Hola! Soy tu asistente turístico. 😊',
    },
    {
      sender: 'bot',
      text: 'Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Ups, algo salió mal. Intenta nuevamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTAuMyAyMiA4LjYgMjEuMzUgNy4zIDIwLjM3TDQuNSA...
            alt="robot"
            style={styles.avatar}
          />
          <div>
            <div style={styles.title}>BrainBot</div>
            <div style={styles.subtitle}>Asistente turístico en Chile</div>
          </div>
        </div>

        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#E6E6E6',
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, backgroundColor: '#E6E6E6' }}>Escribiendo...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            style={styles.input}
          />
          <button type="submit" style={styles.sendButton}>➤</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 12px',
  },
  chatBox: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #eee',
    marginBottom: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
  },
  title: {
    fontWeight: 'bold',
    color: '#25D366',
    fontSize: '16px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#777',
  },
  messages: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '0 8px 16px 8px',
  },
  message: {
    padding: '10px 14px',
    borderRadius: '18px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    borderTop: '1px solid #eee',
    padding: '8px',
  },
  input: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  sendButton: {
    backgroundColor: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};
