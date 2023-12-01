// src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const serverRoutes = require('./routes/server_wifi');
const ticketRoutes = require('./routes/tickets');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Main routes
app.get('/', (req, res) => {
  res.send('Hello, e-ticket app!');
});

// Auth routes
app.use('/auth', authRoutes);

// server wifi routes
app.use('/server', serverRoutes);

// Auth routes
app.use('/attendance', attendanceRoutes);

// Ticket routes
app.use('/tickets', ticketRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
