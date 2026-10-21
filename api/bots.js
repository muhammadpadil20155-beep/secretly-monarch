const { sb, user } = require('./_lib');
const DAYS = { core: 15, plus: 30, pro: 30, elite: 60, infinity: 360 };
module.exports = async (req, res) => {
  const u = await user(req); if (!u) return res.status(401).json({ error: 'Login dulu' });
  if (req.method === 'GET') return res.json(await sb(`bots?owner=eq.${u.id}&order=id.desc`));
  if (req.method === 'POST') {
    const { phone, engine = 'assistant', lang = 'id', plan = 'core' } = req.body || {};
    if (!['assistant', 'store'].includes(engine)) return res.status(400).json({ error: 'Tipe bot tidak valid' });
    if (!/^(62|60)\d{8,13}$/.test(phone || '')) return res.status(400).json({ error: 'Nomor harus 62xxx / 60xxx' });
    const exp = new Date(Date.now() + (DAYS[plan] || 15) * 864e5).toISOString();
    const [bot] = await sb('bots', { method: 'POST', body: JSON.stringify({ owner: u.id, phone, engine, lang, plan, expires_at: exp }) });
    const key = 'sk_' + require('crypto').randomBytes(16).toString('hex');
    await sb('api_keys', { method: 'POST', body: JSON.stringify({ key, owner: u.id, bot_id: bot.id }) });
    return res.json({ bot, apiKey: key });
  }
  res.status(405).end();
};
