// backend/config/db.js
require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error);
  } else {
    console.log("Connected to AWS RDS MySQL!");
  }
});

module.exports = connection;
