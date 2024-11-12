// backend/controllers/userController.js
const connection = require('../config/db');

const getUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
};

const addUser = (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(query, [name, email], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to add user' });
    } else {
      res.json({ message: 'User added successfully', userId: results.insertId });
    }
  });
};

module.exports = { getUsers, addUser };
