const getDatabase = require('../../shared/database');
const db = getDatabase();

const createReportsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      photo_url VARCHAR(500),
      latitude DECIMAL(10,8) NOT NULL DEFAULT 0,
      longitude DECIMAL(11,8) NOT NULL DEFAULT 0,
      waste_type VARCHAR(50) DEFAULT 'other',
      status VARCHAR(50) DEFAULT 'pending',
      user_id INTEGER REFERENCES users(id),
      assigned_to INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS report_comments (
      id SERIAL PRIMARY KEY,
      report_id INTEGER REFERENCES reports(id),
      user_id INTEGER REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

const createCampaignsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      association_id INTEGER REFERENCES users(id),
      location VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL,
      max_participants INTEGER DEFAULT 50,
      status VARCHAR(50) DEFAULT 'upcoming',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS campaign_participants (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id),
      citizen_id INTEGER REFERENCES users(id),
      joined_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS rewards (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      points INTEGER DEFAULT 0,
      badge_name VARCHAR(100),
      reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      report_id INTEGER REFERENCES reports(id),
      agent_id INTEGER REFERENCES users(id),
      assigned_by INTEGER REFERENCES users(id),
      status VARCHAR(50) DEFAULT 'assigned',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};
const createReport = async (
  title,
  description,
  userId,
  latitude,
  longitude,
  photoUrl,
  wasteType
) => {
  const result = await db.query(
    `INSERT INTO reports
     (title, description, 
      user_id, latitude, longitude,
      photo_url, waste_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      title,
      description,
      userId,
      latitude,
      longitude,
      photoUrl,
      wasteType,
    ]
  );
  return result.rows[0];
};
const getAllReports = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const result = await db.query(
    `SELECT * FROM reports
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
};

const getReportById = async (id) => {
  const result = await db.query(
    'SELECT * FROM reports WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getMyReports = async (userId) => {
  const result = await db.query(
    'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const updateReport = async (id, title, description, wasteType) => {
  const result = await db.query(
    `UPDATE reports
     SET title=$1, description=$2, waste_type=$3, updated_at=NOW()
     WHERE id=$4
     RETURNING *`,
    [title, description, wasteType, id]
  );
  return result.rows[0];
};

const updateReportStatus = async (id, status, assignedTo) => {
  const result = await db.query(
    `UPDATE reports
     SET status=$1, assigned_to=$2, updated_at=NOW()
     WHERE id=$3
     RETURNING *`,
    [status, assignedTo, id]
  );
  return result.rows[0];
};

const getNearbyReports = async (latitude, longitude) => {
  const result = await db.query(
    `SELECT *,
     SQRT(
       POWER(CAST(latitude AS FLOAT) - $1, 2) +
       POWER(CAST(longitude AS FLOAT) - $2, 2)
     ) AS distance
     FROM reports
     ORDER BY distance ASC
     LIMIT 20`,
    [parseFloat(latitude), parseFloat(longitude)]
  );
  return result.rows;
};

const getReportStats = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status='in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status='resolved' THEN 1 ELSE 0 END) AS resolved
    FROM reports
  `);
  return result.rows[0];
};

const deleteReport = async (id, userId) => {
  const result = await db.query(
    `DELETE FROM reports
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};

const addComment = async (reportId, userId, content) => {
  const result = await db.query(
    `INSERT INTO report_comments
     (report_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [reportId, userId, content]
  );
  return result.rows[0];
};

const getComments = async (reportId) => {
  const result = await db.query(
    `SELECT rc.*, u.name as user_name
     FROM report_comments rc
     JOIN users u ON rc.user_id = u.id
     WHERE rc.report_id = $1
     ORDER BY rc.created_at ASC`,
    [reportId]
  );
  return result.rows;
};


// CORRECT ✅
module.exports = {
  createReportsTable,
  createCampaignsTable,
  createReport,
  getAllReports,
  getReportById,
  getMyReports,
  updateReport,
  updateReportStatus,
  getNearbyReports,
  getReportStats,
  deleteReport,
  addComment,
  getComments,
};