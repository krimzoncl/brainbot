import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente turístico.' },
    { sender: 'bot', text: 'Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Hubo un error. Intenta nuevamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#FFFFFF',
                border: '1px solid #ddd'
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, backgroundColor: '#FFFFFF', border: '1px solid #ddd' }}>Escribiendo...</div>
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
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100%',
    backgroundColor: '#E5DDD5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  chatBox: {
    width: '100%',
    maxWidth: 400,
    height: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)'
  },
  messages: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto',
    backgroundColor: '#ECE5DD'
  },
  message: {
    maxWidth: '75%',
    padding: '10px 12px',
    borderRadius: '7.5px',
    fontSize: 14,
    lineHeight: 1.4,
    wordBreak: 'break-word'
  },
  inputContainer: {
    padding: '10px',
    backgroundColor: '#F0F0F0',
    borderTop: '1px solid #ddd'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: 14,
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none'
  }
};
