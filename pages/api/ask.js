export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje vacío' });
    }

    const context = `
Negocios certificados en Puerto Varas:
1. Cabañas Lago Sur - +56912345678
2. Café Puerto Dulce - Instagram @puertodulce
3. Tour Volcán Osorno - www.volcanosorno.cl
4. Restaurante Brisa Sur - Av. Costanera 2200
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
          { role: "system", content: "Eres un asistente turístico de Puerto Varas que solo recomienda negocios certificados de una lista fija." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    console.log("Respuesta de OpenAI:", JSON.stringify(data));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ reply: "No encontré respuesta." });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    return res.status(500).json({ reply: "Ocurrió un error en el servidor." });
  }
}
