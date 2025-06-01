export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    const context = `
Negocios certificados en Puerto Varas:
1. Cabañas Lago Sur - +56912345678
2. Café Puerto Dulce - Instagram @puertodulce
3. Tour Volcán Osorno - www.volcanosorno.cl
4. Restaurante Brisa Sur - Av. Costanera 2200
`;

    const prompt = `Eres un asistente turístico de Puerto Varas. Recomienda solo negocios certificados del siguiente listado:\n${context}\n\nPregunta del usuario:\n${message}\n\nRespuesta del asistente:`;


    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus", // mejor calidad
        message: prompt,
        temperature: 0.7,
      })
    });

    const data = await response.json();

    console.log("Respuesta de Cohere:", JSON.stringify(data));

    if (!data.text) {
      return res.status(500).json({ reply: "No encontré respuesta." });
    }

    return res.status(200).json({ reply: data.text });

  } catch (error) {
    console.error("Error al llamar a Cohere:", error);
    return res.status(500).json({ reply: "Ocurrió un error en el servidor." });
  }
}
