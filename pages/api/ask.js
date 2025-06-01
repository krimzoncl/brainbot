export default async function handler(req, res) {
  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Eres un asistente turístico de Puerto Varas. Entrega información útil, recomendaciones, datos de contacto y actividades para quienes visitan la comuna. Solo menciona negocios certificados en la base de datos si se implementa." },
                 { role: "user", content: message }]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No encontré respuesta." });
}