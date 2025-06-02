import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola, soy tu asistente turístico.' },
    { sender: 'bot', text: 'Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses.' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'bot', text: 'Ocurrió un error. Intenta más tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      height: '100vh',
      maxWidth: '400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
    },
    chatBox: {
      padding: '16px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    avatar: {
      width: '40px',
      height: '40px',
    },
    title: {
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: '14px',
      color: '#555',
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '0 16px',
    },
    message: {
      maxWidth: '80%',
      padding: '10px',
      borderRadius: '12px',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    inputContainer: {
      display: 'flex',
      padding: '16px',
      borderTop: '1px solid #ccc',
    },
    input: {
      flex: 1,
      padding: '10px',
      borderRadius: '20px',
      border: '1px solid #ccc',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTAuMyAyMiA4LjYgMjEuMzUgNy4zIDIwLjM3TDQuNSAxOC41NEMyLjggMTcuMzUgMiAxNS4zMiAyIDEzLjI2VjguNzRDMiA2LjY4IDIuOCA0LjY1IDQuNSA..."
            alt="robot"
            style={styles.avatar}
          />
          <div>
            <div style={styles.title}>BrainBot</div>
            <div style={styles.subtitle}>Asistente turístico en Chile</div>
          </div>
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
      </form>
    </div>
  );
}
