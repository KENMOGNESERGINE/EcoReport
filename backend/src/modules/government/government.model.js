const getDatabase = require('../../shared/database');
const db = getDatabase();

const getAllReports = async () => {
  const result = await db.query(
    `SELECT r.*,
     u.name as reporter_name,
     a.name as agent_name
     FROM reports r
     LEFT JOIN users u ON r.user_id = u.id
     LEFT JOIN assignments ass ON r.id = ass.report_id
     LEFT JOIN users a ON ass.agent_id = a.id
     ORDER BY r.created_at DESC`
  );
  return result.rows;
};

const getFullStats = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) as total_reports,
      SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status='in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) as resolved,
      COUNT(DISTINCT user_id) as total_citizens
    FROM reports
  `);
  return result.rows[0];
};

const getHotSpots = async () => {
  const result = await db.query(
    `SELECT
     waste_type,
     COUNT(*) as count,
     latitude,
     longitude
     FROM reports
     WHERE status = 'pending'
     GROUP BY waste_type, latitude, longitude
     ORDER BY count DESC
     LIMIT 10`
  );
  return result.rows;
};

const assignToAgent = async (
  reportId, agentId, assignedBy, notes
) => {
  const result = await db.query(
    `INSERT INTO assignments
     (report_id, agent_id, assigned_by, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [reportId, agentId, assignedBy, notes]
  );

  await db.query(
    `UPDATE reports
     SET status = 'in_progress',
     assigned_to = $1,
     updated_at = NOW()
     WHERE id = $2`,
    [agentId, reportId]
  );

  return result.rows[0];
};

const getAgents = async () => {
  const result = await db.query(
    `SELECT u.*,
     COUNT(a.id) as assigned_reports
     FROM users u
     LEFT JOIN assignments a ON u.id = a.agent_id
     WHERE u.role = 'agent'
     GROUP BY u.id
     ORDER BY u.name ASC`
  );
  return result.rows;
};

const getMonthlyStats = async () => {
  const result = await db.query(`
    SELECT
      DATE_TRUNC('month', created_at) as month,
      COUNT(*) as total,
      SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) as resolved
    FROM reports
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `);
  return result.rows;
};

module.exports = {
  getAllReports,
  getFullStats,
  getHotSpots,
  assignToAgent,
  getAgents,
  getMonthlyStats,
};