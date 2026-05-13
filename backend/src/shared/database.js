const { Pool } = require('pg');

let instance = null;

const createPool = () => {
  return new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
};

const getDatabase = () => {
  if (!instance) {
    instance = createPool();
    console.log('Database connection created');
  }
  return instance;
};

module.exports = getDatabase;