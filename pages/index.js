import React from 'react';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '16px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ color: '#25D366', fontSize: '20px', marginBottom: '4px' }}>Hola, soy tu asistente turístico</h1>
        <p style={{ fontSize: '14px', color: '#444' }}>
          Te puedo ayudar a planificar tu viaje y encontrar las mejores opciones según tus intereses.
        </p>

        <div style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          marginTop: '16px',
          padding: '8px',
          height: '60vh',
          overflowY: 'auto'
        }}>
          {/* Aquí irán los mensajes */}
        </div>

        <form style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '16px',
          border: '1px solid #ccc',
          borderRadius: '20px',
          padding: '8px'
        }}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            style={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button type="submit" style={{ background: 'none', border: 'none', color: '#25D366' }}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}

