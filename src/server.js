const express = require('express');
const bodyParser = require('body-parser');
const { createUserTable } = require('./models/userModel');
const pool = require('./config/db');



const app = express();
const port = process.env.PORT || 1000;

// Middleware
app.use(bodyParser.json());

createUserTable();

app.get('/', (req, res) => res.send('Backend is running'));

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.get('/users', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users');
      res.json(rows);
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).send('Server Error');
    }
  });
