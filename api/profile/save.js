export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { id, unlocked, level, correct, best_streak } = req.body;
  if (!id) return res.status(400).json({ error: 'ID required' });
  const H = {
    'Content-Type': 'application/json',
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Prefer': 'return=representation',
  };
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/quizzers?id=eq.${id}`, {
    method: 'PATCH',
    headers: H,
    body: JSON.stringify({ unlocked, level, correct, best_streak }),
  });
  const [p] = await r.json();
  res.json(p);
}
