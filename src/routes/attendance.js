// In attendance.js

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Mark attendance endpoint
router.post('/mark', async (req, res) => {
  try {
    const { teknisiId, dateAttended, timeAttended } = req.body;

    console.log(req.body)

    // Check if teknisiId, dateAttended, and timeAttended are defined
    if (teknisiId === undefined || dateAttended === undefined || timeAttended === undefined) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    // Check if the teknisi exists
    const [teknisiRows] = await db.promise().execute('SELECT * FROM users WHERE user_id = ?', [teknisiId]);
    if (teknisiRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Teknisi not found' });
    }

    // Insert the attendance record
    const [result] = await db
      .promise()
      .execute(
        'INSERT INTO attendances (teknisi_id, date_attended, time_attended) VALUES (?, ?, ?)',
        [teknisiId, dateAttended, timeAttended]
      );

    // Handle the result and send a response
    res.json({ success: true, message: 'Attendance marked successfully', attendanceId: result.insertId });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, error: 'Error marking attendance' });
  }
});

// Fetch attendance for a teknisi endpoint
router.get('/teknisi/:teknisiId', async (req, res) => {
  try {
    const teknisiId = req.params.teknisiId;

    // Fetch attendance records for the teknisi
    const [attendanceRows] = await db
      .promise()
      .execute('SELECT * FROM attendances WHERE teknisi_id = ?', [teknisiId]);

    // Handle the result and send a response
    res.json({ success: true, attendance: attendanceRows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Error fetching attendance' });
  }
});

module.exports = router;
