const getDatabase = require('../../shared/database');
const db = getDatabase();

const getAreaReports = async (associationId) => {
  const result = await db.query(
    `SELECT r.*,
     u.name as reporter_name
     FROM reports r
     LEFT JOIN users u ON r.user_id = u.id
     WHERE r.status != 'resolved'
     ORDER BY r.created_at DESC`
  );
  return result.rows;
};

const updateReportStatus = async (
  reportId, status, associationId
) => {
  const result = await db.query(
    `UPDATE reports
     SET status = $1,
     updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, reportId]
  );
  return result.rows[0];
};

const getAssociationStats = async (associationId) => {
  const campaigns = await db.query(
    `SELECT COUNT(*) as total_campaigns
     FROM campaigns
     WHERE association_id = $1`,
    [associationId]
  );

  const participants = await db.query(
    `SELECT COUNT(*) as total_participants
     FROM campaign_participants cp
     JOIN campaigns c ON cp.campaign_id = c.id
     WHERE c.association_id = $1`,
    [associationId]
  );

  const resolved = await db.query(
    `SELECT COUNT(*) as total_resolved
     FROM reports
     WHERE status = 'resolved'`
  );

  return {
    totalCampaigns: campaigns.rows[0].total_campaigns,
    totalParticipants: participants.rows[0].total_participants,
    totalResolved: resolved.rows[0].total_resolved,
  };
};

const getAssociationCampaigns = async (associationId) => {
  const result = await db.query(
    `SELECT c.*,
     COUNT(cp.id) as participants_count
     FROM campaigns c
     LEFT JOIN campaign_participants cp
     ON c.id = cp.campaign_id
     WHERE c.association_id = $1
     GROUP BY c.id
     ORDER BY c.date DESC`,
    [associationId]
  );
  return result.rows;
};

module.exports = {
  getAreaReports,
  updateReportStatus,
  getAssociationStats,
  getAssociationCampaigns,
};