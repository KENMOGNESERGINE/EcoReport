const getDatabase = require('../../shared/database');
const db = getDatabase();

const getProfile = async (associationId) => {
  const result = await db.query(
    `SELECT ap.*, u.name, u.email
     FROM association_profiles ap
     RIGHT JOIN users u ON ap.association_id = u.id
     WHERE u.id = $1`,
    [associationId]
  );
  return result.rows[0];
};

const updateProfile = async (associationId, profileData) => {
  const {
    foundedYear, zone, membersCount,
    mission, wasteCollected, phone, website
  } = profileData;

  const result = await db.query(
    `INSERT INTO association_profiles
     (association_id, founded_year, zone,
      members_count, mission, waste_collected,
      phone, website)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (association_id)
     DO UPDATE SET
       founded_year = $2,
       zone = $3,
       members_count = $4,
       mission = $5,
       waste_collected = $6,
       phone = $7,
       website = $8,
       updated_at = NOW()
     RETURNING *`,
    [associationId, foundedYear, zone,
     membersCount, mission, wasteCollected,
     phone, website]
  );
  return result.rows[0];
};

const getAchievements = async (associationId) => {
  const result = await db.query(
    `SELECT * FROM association_achievements
     WHERE association_id = $1
     ORDER BY date DESC`,
    [associationId]
  );
  return result.rows;
};

const addAchievement = async (
  associationId, title, description
) => {
  const result = await db.query(
    `INSERT INTO association_achievements
     (association_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [associationId, title, description]
  );
  return result.rows[0];
};

const getFullProfile = async (associationId) => {
  const profile = await getProfile(associationId);
  const achievements = await getAchievements(associationId);

  const stats = await db.query(
    `SELECT
     COUNT(DISTINCT c.id) as total_campaigns,
     COUNT(DISTINCT cp.citizen_id) as total_participants,
     (SELECT COUNT(*) FROM reports
      WHERE status = 'resolved') as total_resolved
     FROM campaigns c
     LEFT JOIN campaign_participants cp
     ON c.id = cp.campaign_id
     WHERE c.association_id = $1`,
    [associationId]
  );

  return {
    ...profile,
    achievements,
    stats: stats.rows[0],
  };
};

module.exports = {
  getProfile,
  updateProfile,
  getAchievements,
  addAchievement,
  getFullProfile,
};