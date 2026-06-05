const getDatabase = require('../../shared/database');
const db = getDatabase();

const getProfile = async (governmentId) => {
  const result = await db.query(
    `SELECT gp.*, u.name, u.email
     FROM government_profiles gp
     RIGHT JOIN users u ON gp.government_id = u.id
     WHERE u.id = $1`,
    [governmentId]
  );
  return result.rows[0];
};

const updateProfile = async (governmentId, profileData) => {
  const { department, jurisdiction, phone } = profileData;

  const result = await db.query(
    `INSERT INTO government_profiles
     (government_id, department, jurisdiction, phone)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (government_id)
     DO UPDATE SET
       department = $2,
       jurisdiction = $3,
       phone = $4,
       updated_at = NOW()
     RETURNING *`,
    [governmentId, department, jurisdiction, phone]
  );
  return result.rows[0];
};

const getFullProfile = async (governmentId) => {
  const profile = await getProfile(governmentId);

  const stats = await db.query(
    `SELECT
     COUNT(DISTINCT r.id) as total_reports,
     COUNT(DISTINCT a.id) as total_assignments,
     COUNT(DISTINCT a.agent_id) as total_agents,
     SUM(CASE WHEN r.status='resolved'
       THEN 1 ELSE 0 END) as resolved_reports
     FROM reports r
     LEFT JOIN assignments a ON r.id = a.report_id
     WHERE a.assigned_by = $1`,
    [governmentId]
  );

  const avgResolution = await db.query(
    `SELECT
     AVG(EXTRACT(EPOCH FROM
       (updated_at - created_at))/86400) as avg_days
     FROM reports
     WHERE status = 'resolved'`
  );

  return {
    ...profile,
    stats: stats.rows[0],
    avgResolutionDays: Math.round(
      avgResolution.rows[0]?.avg_days || 0
    ),
  };
};

module.exports = {
  getProfile,
  updateProfile,
  getFullProfile,
};