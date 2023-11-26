// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, full_name, email, phone_number } = req.body;

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database using promise-based execute
    const [result] = await db.promise().execute(
      'INSERT INTO users (username, password_hash, role, full_name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, role, full_name, email, phone_number]
    );

    // Ambil nilai dari hasil query
    const newUserId = result.insertId;

    res.json({ success: true, message: 'User registered successfully', userId: newUserId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.json({ success: false, error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user based on username
    const [userRows] = await db.promise().execute('SELECT * FROM users WHERE username = ?', [username]);

    // If user is not found
    if (userRows.length === 0) {
      return res.json({ success: false, error: 'Invalid username or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userRows[0].password_hash);

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid username or password' });
    }

    // User successfully logged in
    res.json({ success: true, message: 'Login successful', user: userRows[0] });
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, error: 'Login failed' });
  }
});

module.exports = router;
