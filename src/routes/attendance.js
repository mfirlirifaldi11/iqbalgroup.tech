const express = require('express');
const router = express.Router();
const db = require('../config/db');
const path = require('path');
const multer = require('multer');
const config = require('../config/config'); // Sesuaikan path sesuai struktur proyek Anda


// Fetch all attendance records endpoint
router.get('/', async (req, res) => {
  try {
    // Fetch all attendance records
    const [attendanceRows] = await db.promise().query('SELECT * FROM attendances');

    // Handle the result and send a response
    res.json({ success: true, attendance: attendanceRows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Error fetching attendance' });
  }
});

// Fetch attendance for a specific user endpoint
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch attendance records for the specified user
    const [attendanceRows] = await db
      .promise()
      .query('SELECT * FROM attendances WHERE user_id = ?', [userId]);

    // Handle the result and send a response
    res.json({ success: true, attendance: attendanceRows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: 'Error fetching attendance' });
  }
});

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/attendance/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage }).single('photo_url');

// Mark time in endpoint
router.post('/timein', upload, async (req, res) => {
  try {
    const { user_id, date_attended, time_in, latitude, longitude } = req.body;

    const photoUrl = req.file ? req.file.filename : null;

    console.log(photoUrl);

    if (!photoUrl) {
      return res.status(400).json({ success: false, error: 'No photo uploaded' });
    }

    // Periksa apakah user_id, date_attended, dan time_in telah didefinisikan
    if (user_id === undefined || date_attended === undefined || time_in === undefined) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    // Simpan photoUrl ke dalam database dan dapatkan nilai result
    const [result] = await db.promise().execute(
      'INSERT INTO attendances (user_id, date_attended, time_in, latitude, longitude, photo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, date_attended, time_in,  latitude, longitude, photoUrl]
    );

    res.json({ success: true, message: 'Time in recorded successfully', attendanceId: result.insertId });
  } catch (error) {
    console.error('Error recording time in:', error);
    res.status(500).json({ success: false, error: 'Error recording time in' });
  }
});



// Update time out endpoint
router.post('/timeout/:attendanceId', async (req, res) => {
  try {
    const attendanceId = req.params.attendanceId;
    const { time_out } = req.body;

    // Update attendance dengan nilai time_out yang baru
    await db
      .promise()
      .execute(
        'UPDATE attendances SET time_out = ? WHERE attendance_id = ?',
        [time_out, attendanceId]
      );

    return res.json({ success: true, message: 'Time out recorded successfully' });
  } catch (error) {
    console.error('Error recording time out:', error);
    res.status(500).json({ success: false, error: 'Error recording time out' });
  }  
});


module.exports = router;