module.exports = (req, res) => res.json({ url: process.env.SUPABASE_URL, anon: process.env.SUPABASE_ANON_KEY, channel: process.env.WA_CHANNEL_URL });
