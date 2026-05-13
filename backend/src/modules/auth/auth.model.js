//This file talks DIRECTLY to the database
const getDatabase = require('../../shared/database');
const db = getDatabase();

//USERS-TABLE
const createUsersTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'citizen',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const createUser = async (name, email, password, role) => {
  const result = await db.query(
    `INSERT INTO users
     (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, password, role]
  );
  return result.rows[0];
};


module.exports = {
  createUsersTable,
  findUserByEmail,
  createUser,
};