export default async function handler(req, res) {
  const { message } = req.body;

  const context = `
Negocios certificados en Puerto Varas:
- Cabañas Lago Sur: Alojamiento con vista al lago. +56912345678
- Café Puerto Dulce: Cafetería con repostería local. Instagram @puertodulce
- Tour Volcán Osorno: Operador turístico con salidas diarias. www.volcanosorno.cl
`;

  const prompt = `Contexto:\n${context}\n\nPregunta del usuario: ${message}\n\nRespuesta del asistente turístico:`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente turístico de Puerto Varas que responde solo con información local verificada." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "No encontré respuesta.";
  res.status(200).json({ reply });
}
