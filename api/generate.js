export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Not allowed' });
  try {
    const { category } = req.body;
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500,
        messages: [{ role: 'user', content: `Generate 12 trivia questions (4 easy, 4 medium, 4 hard) for kids (3rd-4th grade) for category: "${category}". Return ONLY raw JSON array, no markdown. Each object: q (string), a (UPPERCASE answers array), d ("easy"|"medium"|"hard"). Example: [{"q":"Closest planet to Sun?","a":["MERCURY"],"d":"easy"}]` }] })
    });
    const data = await r.json();
    const questions = JSON.parse(data.content[0].text.replace(/```json|```/g,'').trim());
    res.json(questions.map(q => ({ ...q, d: q.d||'medium', cat: category })));
  } catch(e) { res.status(500).json({ error: 'Failed' }); }
}
