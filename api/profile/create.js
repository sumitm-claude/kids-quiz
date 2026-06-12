export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
  const H = {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  };
  let pin, tries = 0;
  while (tries++ < 20) {
    pin = String(Math.floor(1000 + Math.random() * 9000));
    const chk = await fetch(`${process.env.SUPABASE_URL}/rest/v1/quizzers?pin=eq.${pin}&select=id`, { headers: H });
    if ((await chk.json()).length === 0) break;
  }
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/quizzers`, {
    method: 'POST',
    headers: { ...H, 'Prefer': 'return=representation' },
    body: JSON.stringify({ name: name.trim(), pin, unlocked: ['easy'], level: 'easy', correct: 0, best_streak: 0 }),
  });
  const [p] = await r.json();
  res.json(p);
}
