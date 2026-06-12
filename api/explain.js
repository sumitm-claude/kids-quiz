export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { q, a, cat } = req.body;
  if (!q || !a) return res.status(400).json({ error: 'Missing fields' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 80,
        messages: [{ role: 'user', content: `In one short sentence (max 20 words), explain why "${a}" is the answer to this trivia question: "${q}". Start directly with the fact, no intro phrases.` }]
      })
    });
    const data = await r.json();
    res.json({ explanation: data.content[0].text.trim() });
  } catch(e) { res.status(500).json({ error: 'Failed' }); }
}
