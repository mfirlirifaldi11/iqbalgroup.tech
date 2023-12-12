const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get user data with photo endpoint
router.get('/get-user-with-photo/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve user data with photo URL from the database
    const [userRows] = await db.promise().execute('SELECT * FROM users WHERE user_id = ?', [userId]);

    // If user not found
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = userRows[0];

    // If user photo URL is available, construct the full path to the photo
    if (user.photo_url) {
      user.photo_url = `uploads/profile/${user.photo_url}`;
    }

    // Return user data with photo
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error getting user data with photo:', error);
    res.status(500).json({ success: false, error: 'Failed to get user data with photo' });
  }
});

module.exports = router;
