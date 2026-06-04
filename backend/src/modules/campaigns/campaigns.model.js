const getDatabase = require('../../shared/database');
const db = getDatabase();

const createCampaign = async (
  title, description, associationId,
  location, date, maxParticipants
) => {
  const result = await db.query(
    `INSERT INTO campaigns
     (title, description, association_id,
      location, date, max_participants)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, description, associationId,
     location, date, maxParticipants]
  );
  return result.rows[0];
};

const getAllCampaigns = async () => {
  const result = await db.query(
    `SELECT c.*,
     u.name as association_name,
     COUNT(cp.id) as participants_count
     FROM campaigns c
     LEFT JOIN users u ON c.association_id = u.id
     LEFT JOIN campaign_participants cp ON c.id = cp.campaign_id
     GROUP BY c.id, u.name
     ORDER BY c.date ASC`
  );
  return result.rows;
};

const getCampaignById = async (id) => {
  const result = await db.query(
    `SELECT c.*,
     u.name as association_name,
     COUNT(cp.id) as participants_count
     FROM campaigns c
     LEFT JOIN users u ON c.association_id = u.id
     LEFT JOIN campaign_participants cp ON c.id = cp.campaign_id
     WHERE c.id = $1
     GROUP BY c.id, u.name`,
    [id]
  );
  return result.rows[0];
};

const joinCampaign = async (campaignId, citizenId) => {
  const result = await db.query(
    `INSERT INTO campaign_participants
     (campaign_id, citizen_id)
     VALUES ($1, $2)
     RETURNING *`,
    [campaignId, citizenId]
  );
  return result.rows[0];
};

const leaveCampaign = async (campaignId, citizenId) => {
  const result = await db.query(
    `DELETE FROM campaign_participants
     WHERE campaign_id = $1
     AND citizen_id = $2
     RETURNING *`,
    [campaignId, citizenId]
  );
  return result.rows[0];
};

const getMyCampaigns = async (citizenId) => {
  const result = await db.query(
    `SELECT c.*, u.name as association_name
     FROM campaigns c
     JOIN campaign_participants cp ON c.id = cp.campaign_id
     JOIN users u ON c.association_id = u.id
     WHERE cp.citizen_id = $1`,
    [citizenId]
  );
  return result.rows;
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  joinCampaign,
  leaveCampaign,
  getMyCampaigns,
};