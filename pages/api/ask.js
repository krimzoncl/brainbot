export default async function handler(req, res) {
  try {
    const { destino, personas, dias } = req.body;

    if (!destino || !personas || !dias) {
      return res.status(400).json({ error: "Faltan datos para generar recomendaciones." });
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

    // 2. Filtrar por certificado y con posible mención a TripAdvisor
    const certificados = data.filter(item =>
      item.certificado?.toLowerCase() === 'sí' &&
      (item.web?.toLowerCase().includes('tripadvisor') || item.descripcion?.toLowerCase().includes('tripadvisor'))
    );

    const context = certificados.map((item, i) => (
      `${i + 1}. ${item.nombre} (${item.tipo}) - ${item.descripcion || 'Sin descripción'} - ${item.comuna} - ${item.contacto}`
    )).join("\n");

    // 3. Prompt mejorado
    const prompt = `Eres un asistente turístico chileno. Basado en este listado de negocios certificados con buena reputación (algunos en TripAdvisor), responde de forma breve, clara y simpática a esta solicitud:

Destino: ${destino}
Cantidad de personas: ${personas}
Duración del viaje: ${dias} días

Listado:
${context}

Recomienda solo si hay coincidencias útiles para ese destino. Si no hay coincidencias, sugiere alternativas cercanas o explica que no tienes opciones disponibles. No inventes datos. Responde como un asistente conversacional.`

    // 4. Llamar a Cohere
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: prompt,
        temperature: 0.6,
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
