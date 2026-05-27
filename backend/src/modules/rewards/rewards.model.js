const getDatabase = require('../../shared/database');
const db = getDatabase();

const addPoints = async (userId, points, reason, badgeName) => {
  const result = await db.query(
    `INSERT INTO rewards
     (user_id, points, reason, badge_name)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, points, reason, badgeName]
  );
  return result.rows[0];
};

const getUserPoints = async (userId) => {
  const result = await db.query(
    `SELECT
     SUM(points) as total_points,
     COUNT(*) as total_rewards
     FROM rewards
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

const getUserRewards = async (userId) => {
  const result = await db.query(
    `SELECT * FROM rewards
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getLeaderboard = async () => {
  const result = await db.query(
    `SELECT
     u.id, u.name,
     SUM(r.points) as total_points,
     COUNT(r.id) as total_rewards
     FROM users u
     LEFT JOIN rewards r ON u.id = r.user_id
     WHERE u.role = 'citizen'
     GROUP BY u.id, u.name
     ORDER BY total_points DESC
     LIMIT 10`
  );
  return result.rows;
};

const getBadge = (totalPoints) => {
  if (totalPoints >= 500) return '🏆 Champion';
  if (totalPoints >= 200) return '🥇 Expert';
  if (totalPoints >= 100) return '🥈 Active';
  if (totalPoints >= 50)  return '🥉 Starter';
  return '🌱 Beginner';
};

module.exports = {
  addPoints,
  getUserPoints,
  getUserRewards,
  getLeaderboard,
  getBadge,
};