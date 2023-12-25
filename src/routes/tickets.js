// In ticket.js or a similar file in your routes folder

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Post Ticket endpoint
router.post('/create', async (req, res) => {
  try {
    const {
      fullName,
      serviceType,
      dateRequested,
      timeRequested,
      status,
      feedback,
      rating,
    } = req.body;

    // Check if fullName, serviceType, dateRequested, timeRequested, status are defined
    if (
      fullName === undefined ||
      serviceType === undefined ||
      dateRequested === undefined ||
      timeRequested === undefined ||
      status === undefined
    ) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    // Check if the user (fullName) exists
    const [userRows] = await db
      .promise()
      .execute('SELECT * FROM users WHERE full_name = ?', [fullName]);

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Insert the Ticket record
    const [result] = await db
      .promise()
      .execute(
        'INSERT INTO tickets (user_id, service_type, date_requested, time_requested, status, feedback, rating, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          userRows[0].user_id,
          serviceType,
          dateRequested,
          timeRequested,
          status,
          feedback || null, // Pass null if feedback is undefined
          rating || null,   // Pass null if rating is undefined
          fullName,
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
router.get('/user/:fullName', async (req, res) => {
  try {
    const fullName = req.params.fullName;

    // Fetch Ticket records for the user
    const [ticketRows] = await db
      .promise()
      .execute('SELECT * FROM tickets WHERE created_by = ?', [fullName]);

    // Handle the result and send a response
    res.json({ success: true, tickets: ticketRows });
  } catch (error) {
    console.error('Error fetching Tickets:', error);
    res.status(500).json({ success: false, error: 'Error fetching Tickets' });
  }
});

// Update Ticket status endpoint
router.put('/update/status/:ticketId', async (req, res) => {
  try {
    const { status, updateBy } = req.body; // Add updateBy to the request body
    const ticketId = req.params.ticketId;

    // Check if status is defined
    if (status === undefined || updateBy === undefined) {
      return res.status(400).json({ success: false, error: 'Invalid parameters' });
    }

    // Update the Ticket status and set the update_by field
    const [result] = await db
      .promise()
      .execute('UPDATE tickets SET status = ?, updated_by = ? WHERE ticket_id = ?', [status, updateBy, ticketId]);

    // Check if the ticket was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    // Handle the result and send a response
    res.json({ success: true, message: 'Ticket status updated successfully' });
  } catch (error) {
    console.error('Error updating Ticket status:', error);
    res.status(500).json({ success: false, error: 'Error updating Ticket status' });
  }
});

module.exports = router;
