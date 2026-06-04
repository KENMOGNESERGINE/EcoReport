const getDatabase = require('../../shared/database');
const db = getDatabase();

const getAllUsers = async () => {
  const result = await db.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
};

const deleteUser = async (userId) => {
  const result = await db.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, name, email`,
    [userId]
  );
  return result.rows[0];
};

const changeUserRole = async (userId, role) => {
  const result = await db.query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, name, email, role`,
    [role, userId]
  );
  return result.rows[0];
};

const deleteReport = async (reportId) => {
  const result = await db.query(
    `DELETE FROM reports
     WHERE id = $1
     RETURNING *`,
    [reportId]
  );
  return result.rows[0];
};

const getAdminStats = async () => {
  const users = await db.query(
    `SELECT
     COUNT(*) as total_users,
     SUM(CASE WHEN role='citizen' THEN 1 ELSE 0 END) as citizens,
     SUM(CASE WHEN role='association' THEN 1 ELSE 0 END) as associations,
     SUM(CASE WHEN role='government' THEN 1 ELSE 0 END) as government,
     SUM(CASE WHEN role='agent' THEN 1 ELSE 0 END) as agents
     FROM users`
  );

  const reports = await db.query(
    `SELECT
     COUNT(*) as total_reports,
     SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
     SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) as resolved
     FROM reports`
  );

  const campaigns = await db.query(
    `SELECT COUNT(*) as total_campaigns FROM campaigns`
  );

  return {
    users: users.rows[0],
    reports: reports.rows[0],
    campaigns: campaigns.rows[0],
  };
};

module.exports = {
  getAllUsers,
  deleteUser,
  changeUserRole,
  deleteReport,
  getAdminStats,
};