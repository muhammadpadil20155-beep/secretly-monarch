const { sb } = require('./_lib');
module.exports = async (req, res) => {
  const bots = (await sb('bots?select=status,stats')) || [];
  const sum = k => bots.reduce((a, b) => a + (b.stats?.[k] || 0), 0);
  res.setHeader('Cache-Control', 's-maxage=60');
  res.json({ total: bots.length, online: bots.filter(b => b.status === 'online').length, users: sum('users'), chats: sum('chats'), groups: sum('groups') });
};
