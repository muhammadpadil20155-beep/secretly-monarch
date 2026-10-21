// API Gateway: client -> Vercel (cek API key + rate limit) -> Panel bot
const { sb } = require('./_lib');
const seen = new Map();
module.exports = async (req, res) => {
  const key = req.headers['x-api-key']; if (!key) return res.status(401).json({ error: 'x-api-key wajib' });
  const n = (seen.get(key) || 0) + 1; seen.set(key, n); setTimeout(() => seen.delete(key), 60000);
  if (n > 30) return res.status(429).json({ error: 'Maks 30 request/menit' });
  const [k] = (await sb(`api_keys?key=eq.${encodeURIComponent(key)}`)) || [];
  if (!k) return res.status(403).json({ error: 'API key tidak valid' });
  const { to, text } = req.body || {}; if (!to || !text) return res.status(400).json({ error: 'to & text wajib' });
  await sb(`api_keys?key=eq.${encodeURIComponent(key)}`, { method: 'PATCH', body: JSON.stringify({ hits: k.hits + 1 }) });
  const r = await fetch(`${process.env.PANEL_URL}/send`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-panel-token': process.env.PANEL_TOKEN }, body: JSON.stringify({ botId: k.bot_id, to, text }) });
  res.status(r.status).json(await r.json().catch(() => ({})));
};
