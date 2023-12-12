const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Register endpoint with combined image upload and registration
router.post('/register', upload.single('photo'), async (req, res) => {
  try {
    const { username, password, role_name, full_name, email, phone_number } = req.body;

    // Check if password is present
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }

    // Generate salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, salt);

    // Call the image upload endpoint
    const photoUrl = req.file ? req.file.filename : null;

    console.log(photoUrl);

    if (!photoUrl) {
      return res.status(400).json({ success: false, error: 'No photo uploaded' });
    }

    // Insert user into the database using promise-based execute
    const [roleResult] = await db.promise().execute(
      'SELECT `role_id` FROM `user_roles` WHERE `role_name` = ?',
      [role_name]
    );

    if (roleResult.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid role name' });
    }

    const roleId = roleResult[0].role_id;

    const [userResult] = await db.promise().execute(
      'INSERT INTO users (username, password_hash, role_id, full_name, email, phone_number, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, roleId, full_name, email, phone_number, photoUrl]
    );

    // Retrieve user ID from the result
    const newUserId = userResult.insertId;

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

    // Find user by username
    const [userRows] = await db.promise().execute('SELECT * FROM users WHERE username = ?', [username]);

    // If user not found
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
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

module.exports = router;
