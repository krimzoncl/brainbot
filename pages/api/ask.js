export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // 1. Leer negocios desde Google Sheet como CSV
    const sheetUrl = process.env.SHEET_URL;
    const csvRes = await fetch(sheetUrl);
    const csvText = await csvRes.text();

    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");
    const data = lines.slice(1).map(line => {
      const values = line.split(",");
      return headers.reduce((acc, h, i) => {
        acc[h.trim()] = values[i]?.trim();
        return acc;
      }, {});
    });

    const context = data.map((item, i) => (
      `${i + 1}. ${item.nombre} (${item.tipo}) - ${item.contacto}`
    )).join("\n");

    // 2. Armar prompt
    const prompt = `Eres un asistente turístico de Puerto Varas. Recomienda solo negocios certificados del siguiente listado:\n${context}\n\nPregunta del usuario:\n${message}\n\nRespuesta del asistente:`;

    // 3. Llamar a Cohere
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: prompt,
        temperature: 0.7,
      })
    });

    const dataJson = await response.json();

    if (!dataJson.text) {
      console.error("Error desde Cohere:", dataJson);
      return res.status(500).json({ reply: "No encontré respuesta." });
    }

    return res.status(200).json({ reply: dataJson.text });

  } catch (error) {
    console.error("Error general:", error.message || error);
    return res.status(500).json({ reply: "Ocurrió un error en el servidor." });
  }
}
