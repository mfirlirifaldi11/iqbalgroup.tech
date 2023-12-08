const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint to get user roles
router.get('/user_roles', async (req, res) => {
  try {
    // Fetch user roles from the database
    const [roles] = await db.promise().execute('SELECT * FROM user_roles');

    // Extract role names from the result
    const roleNames = roles.map((role) => role.role_name);

    // Return the role names in the response
    res.json(roles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
