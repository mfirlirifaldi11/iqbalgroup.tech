// In ticket.js or a similar file in your routes folder

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Post Ticket endpoint
router.post('/create', async (req, res) => {
  try {
    const {
      mitraId,
      teknisiId,
      serviceType,
      dateRequested,
      timeRequested,
      status,
      feedback,
      rating,
    } = req.body;

    // Check if mitraId, teknisiId, serviceType, dateRequested, timeRequested, status are defined
    if (
      mitraId === undefined ||
      teknisiId === undefined ||
      serviceType === undefined ||
      dateRequested === undefined ||
      timeRequested === undefined ||
      status === undefined
    ) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    // Check if the mitra and teknisi exist
    const [mitraRows] = await db
      .promise()
      .execute('SELECT * FROM users WHERE user_id = ?', [mitraId]);

    const [teknisiRows] = await db
      .promise()
      .execute('SELECT * FROM users WHERE user_id = ?', [teknisiId]);

    if (mitraRows.length === 0 || teknisiRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Mitra or Teknisi not found' });
    }

    // Insert the Ticket record
    const [result] = await db
      .promise()
      .execute(
        'INSERT INTO tickets (mitra_id, teknisi_id, service_type, date_requested, time_requested, status, feedback, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          mitraId,
          teknisiId,
          serviceType,
          dateRequested,
          timeRequested,
          status,
          feedback || null, // Pass null if feedback is undefined
          rating || null,   // Pass null if rating is undefined
        ]
      );

    // Handle the result and send a response
    res.json({ success: true, message: 'Ticket posted successfully', ticketId: result.insertId });
  } catch (error) {
    console.error('Error posting Ticket:', error);
    res.status(500).json({ success: false, error: 'Error posting Ticket' });
  }
});

// Fetch Tickets for a user endpoint
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch Ticket records for the user
    const [ticketRows] = await db
      .promise()
      .execute('SELECT * FROM tickets WHERE mitra_id = ? OR teknisi_id = ?', [userId, userId]);

    // Handle the result and send a response
    res.json({ success: true, tickets: ticketRows });
  } catch (error) {
    console.error('Error fetching Tickets:', error);
    res.status(500).json({ success: false, error: 'Error fetching Tickets' });
  }
});

module.exports = router;
