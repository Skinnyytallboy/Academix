// backend/routes/authRoutes.js
const express = require('express');
const connection = require('../config/db');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database to check for matching user credentials
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    // Return user details along with role
    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });
  });
});

module.exports = router;
