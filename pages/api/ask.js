export default async function handler(req, res) {
  const { message } = req.body;

  const negocios = `
1. **Cabañas Lago Sur** - Alojamiento familiar con vista al lago. 📞 +56912345678
2. **Café Puerto Dulce** - Cafetería con repostería local. 📸 Instagram: @puertodulce
3. **Tour Volcán Osorno** - Operador turístico con salidas diarias. 🌐 www.volcanosorno.cl
4. **Hostal Patagón** - Económico, céntrico. 📞 +56987654321
5. **Restaurante Brisa Sur** - Comida chilena con vista al lago. 📍 Av. Costanera 2200
`;

  const prompt = `Estás ayudando a un turista que va a Puerto Varas. Solo recomiendas negocios certificados. Estos son los negocios disponibles:\n${negocios}\n\nPregunta del turista: ${message}\n\nResponde de forma útil, cálida y con datos concretos (nombres, links o teléfonos si hay).`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente turístico de Puerto Varas, directo y amigable. Solo recomiendas lugares certificados de la lista." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "No encontré respuesta.";

  res.status(200).json({ reply });
}
