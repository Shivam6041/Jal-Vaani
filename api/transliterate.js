// api/transliterate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a transliteration assistant. Only return transliterated text."
          },
          { role: "user", content: text }
        ]
      })
    });

    const json = await apiRes.json();

    res.status(200).json({
      original: text,
      transliterated: json.choices[0].message.content.trim(),
      confidence: 1 // placeholder confidence
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
}
