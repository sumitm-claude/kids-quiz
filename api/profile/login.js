export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ error: 'PIN required' });
  const H = {
    'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  };
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/quizzers?pin=eq.${pin}&select=*`, { headers: H });
  const data = await r.json();
  if (!data.length) return res.status(404).json({ error: 'Not found' });
  res.json(data[0]);
}
