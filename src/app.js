// src/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const serverRoutes = require('./routes/server_wifi');
const ticketRoutes = require('./routes/tickets');
const userRolesRoutes = require('./routes/user_roles');
const userRoutes = require('./routes/user');
const db = require('./config/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

app.use('/uploads/profile', express.static('uploads/profile'));

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
app.use('/roles', userRolesRoutes);

// server wifi routes
app.use('/server', serverRoutes);

// Auth routes
app.use('/attendance', attendanceRoutes);

// Ticket routes
app.use('/tickets', ticketRoutes);

// User routes
app.use('/user', userRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
