const connection = require('../config/db');

const getUsers = (req, res) => {
  const query = 'SELECT * FROM User';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }
    return res.json({ status: 'success', data: results });
  });
};

const addUser = (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ status: 'error', message: 'Missing username, email, password, or role' });
  }
  const query = 'INSERT INTO User (username, email, password, role) VALUES (?, ?, ?, ?)';
  connection.query(query, [username, email, password, role], (err, results) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }
    return res.status(201).json({ status: 'success', message: 'User added successfully', userId: results.insertId });
  });
};

module.exports = { getUsers, addUser };



// // userController.js
// const User = require('../models/User');

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     if (user.password !== password) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }
//     const { password: _, ...userData } = user.toObject();
//     return res.status(200).json(userData);
//   } catch (error) {
//     console.error('Error during login:', error);
//     return res.status(500).json({ message: 'An error occurred during login' });
//   }
// };


// // backend/controllers/userController.js
// const connection = require('../config/db');

// const getUsers = (req, res) => {
//   const query = 'SELECT * FROM users';
//   connection.query(query, (err, results) => {
//     if (err) {
//       res.status(500).json({ error: 'Database query failed' });
//     } else {
//       res.json(results);
//     }
//   });
// };

// const addUser = (req, res) => {
//   const { name, email } = req.body;
//   const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
//   connection.query(query, [name, email], (err, results) => {
//     if (err) {
//       res.status(500).json({ error: 'Failed to add user' });
//     } else {
//       res.json({ message: 'User added successfully', userId: results.insertId });
//     }
//   });
// };

// module.exports = { getUsers, addUser };
