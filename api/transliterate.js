export default async function handler(req, res) {
  try {
    const { text } = req.body;
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a transliteration assistant. Only return transliterated text." },
          { role: "user", content: text }
        ]
      })
    });
    const json = await apiRes.json();
    res.status(200).json({ output: json.choices[0].message.content.trim() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
