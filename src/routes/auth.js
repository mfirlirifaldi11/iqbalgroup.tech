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
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Register endpoint
router.post('/register', async (req, res) => {
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
      'INSERT INTO users (username, password_hash, role_id, full_name, email, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, roleId, full_name, email, phone_number]
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

// Update user photo URL endpoint
router.post('/update-photo', upload.single('photo'), async (req, res) => {
  try {
    const { userId } = req.body;
    const photoUrl = req.file ? req.file.filename : null;

    // Update user's photo URL in the database
    await db.promise().execute('UPDATE users SET photo_url = ? WHERE user_id = ?', [photoUrl, userId]);

    res.json({ success: true, message: 'Photo URL updated successfully' });
  } catch (error) {
    console.error('Error updating user photo URL:', error);
    res.status(500).json({ success: false, error: 'Failed to update photo URL' });
  }
});

// Serve static files (user profile photos)
router.use('/uploads', express.static('uploads'));

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari pengguna berdasarkan username
    const [userRows] = await db.promise().execute('SELECT * FROM users WHERE username = ?', [username]);

    // Jika pengguna tidak ditemukan
    if (userRows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, userRows[0].password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }

    // Pengguna berhasil masuk
    res.json({ success: true, message: 'Login successful', user: userRows[0] });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Update user photo URL endpoint
router.post('/update-photo', async (req, res) => {
  try {
    const { userId, photoUrl } = req.body;

    // Update user's photo URL in the database
    await db.promise().execute('UPDATE users SET photo_url = ? WHERE user_id = ?', [photoUrl, userId]);

    res.json({ success: true, message: 'Photo URL updated successfully' });
  } catch (error) {
    console.error('Error updating user photo URL:', error);
    res.status(500).json({ success: false, error: 'Failed to update photo URL' });
  }
});

module.exports = router;
