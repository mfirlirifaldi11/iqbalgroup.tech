// src/config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Sesuaikan dengan username MySQL Anda
  password: '',   // Sesuaikan dengan password MySQL Anda
  database: 'iqbalgroup.tech', // Sesuaikan dengan nama database Anda
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = connection;
