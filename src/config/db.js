// src/config/db.js
const mysql = require('mysql2');

// Buat koneksi pool dengan mode promise
const pool = mysql.createPool({
  host: 'localhost',
  user: 'piew',
  password: 'piew123',
  database: 'iqbalgroup.tech',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  Promise: require('bluebird') // Gunakan library promise (contoh: bluebird)
});

// Ekspor objek koneksi pool
module.exports = pool;
