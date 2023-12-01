// server_wifi.js (atau file serupa di direktori routes)

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint untuk menambahkan server WiFi
router.post('/add', async (req, res) => {
  try {
    const { name, address, ip, port } = req.body;

    // Pastikan name tidak kosong
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    // Insert record ke dalam tabel wifi_servers
    const [result] = await db
      .promise()
      .execute(
        'INSERT INTO wifi_servers (name, address, ip, port) VALUES (?, ?, ?, ?)',
        [name, address || null, ip || null, port || null]
      );

    // Kirim respons
    res.json({ success: true, message: 'WiFi server added successfully', serverId: result.insertId });
  } catch (error) {
    console.error('Error adding WiFi server:', error);
    res.status(500).json({ success: false, error: 'Error adding WiFi server' });
  }
});

// Endpoint untuk mendapatkan semua data server WiFi
router.get('/list', async (req, res) => {
  try {
    // Ambil semua data dari tabel wifi_servers
    const [rows] = await db
      .promise()
      .query('SELECT * FROM wifi_servers');

    // Kirim respons dengan data server WiFi
    res.json({ success: true, servers: rows });
  } catch (error) {
    console.error('Error fetching WiFi servers:', error);
    res.status(500).json({ success: false, error: 'Error fetching WiFi servers' });
  }
});

module.exports = router;
