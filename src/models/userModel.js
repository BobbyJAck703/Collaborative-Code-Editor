const pool = require('../config/db.js');

// Function to create 'users' table
const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `);
};

module.exports = { createUserTable };
