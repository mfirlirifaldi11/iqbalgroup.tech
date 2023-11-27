const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, full_name, email, phone_number } = req.body;

    console.log('Request Body:', req.body);

    // Check if password is present
    if (!password) {
      console.log(password)
      return res.status(400).json({ success: false, error: 'Password is required' });

    }

    // Generate salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database using promise-based execute
    const [result] = await db.promise().execute(
      'INSERT INTO users (username, password_hash, role, full_name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, role, full_name, email, phone_number]
    );

    // Retrieve user ID from the result
    const newUserId = result.insertId;

    // Log the registration success
    console.log('User registered successfully:', { userId: newUserId, username, email });

    // Return success response
    res.json({ success: true, message: 'User registered successfully', userId: newUserId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(req.body)

    // Find user based on username
    const [userRows] = await db.promise().execute('SELECT * FROM users WHERE username = ?', [username]);

    // If user is not found
    if (userRows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userRows[0].password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    // User successfully logged in
    res.json({ success: true, message: 'Login successful', user: userRows[0] });
    console.log(res.json)
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

module.exports = router;
