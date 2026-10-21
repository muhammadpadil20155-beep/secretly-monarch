const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
exports.sb = async (path, opt = {}) => {
  const r = await fetch(`${U}/rest/v1/${path}`, { ...opt, headers: { apikey: K, ...(K.startsWith('sb_') ? {} : { Authorization: `Bearer ${K}` }), 'Content-Type': 'application/json', Prefer: 'return=representation', ...(opt.headers || {}) } });
  const t = await r.text(); return t ? JSON.parse(t) : null;
};
exports.user = async (req) => {
  const tk = (req.headers.authorization || '').replace('Bearer ', ''); if (!tk) return null;
  const r = await fetch(`${U}/auth/v1/user`, { headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${tk}` } });
  return r.ok ? r.json() : null;
};
