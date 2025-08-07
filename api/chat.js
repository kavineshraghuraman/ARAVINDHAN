export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a Tamil-speaking assistant helping Indian farmers." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await openaiRes.json();

    if (data.error) {
      return res.status(500).json({ reply: "OpenAI பிழை: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content;
    res.status(200).json({ reply: reply || "பதில் வரவில்லை." });
  } catch (err) {
    res.status(500).json({ reply: "சேவையில் பிழை ஏற்பட்டது." });
  }
}
