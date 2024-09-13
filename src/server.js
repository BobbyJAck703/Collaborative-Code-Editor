const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUserTable, createUser, findUserByUsername } = require('./models/userModel');
const pool = require('./config/db');

const app = express();
const port = process.env.PORT || 1000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your secret

// Middleware
app.use(bodyParser.json());

// Create User Table
createUserTable();

// Basic Route
app.get('/', (req, res) => res.send('Backend is running'));

// Registration Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser(username, hashedPassword);

    // Respond with user details (excluding password)
    const { password: _, ...user } = newUser;
    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server Error');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Find user by username
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server Error');
  }
});

// Users Endpoint
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
