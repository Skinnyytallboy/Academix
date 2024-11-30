//get users for admin userManagment
const express = require('express');
const router = express.Router();
const connection = require('../config/db');

//display all users //working
router.get('/users', (req, res) => {
  // Query to get all users
  const query = `
    SELECT user_id, username, email, role
    FROM User
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database error (users):', err);
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }

    if (results.length === 0) {
      console.log('No users found.');
      return res.status(404).json({ status: 'error', message: 'No users found.' });
    }

    const response = results.map(user => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role
    }));

    console.log('Query successful, response:', response);
    res.status(200).json({ status: 'success', users: response });
  });
});

//add user //also need to handle adding the user in their specific table
router.post('/users', (req, res) => {
  const { username, email, password, role, studentDetails, teacherDetails, adminDetails } = req.body;

  // Check for required fields
  if (!username || !email || !password || !role) {
    return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  // Validate role
  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ status: 'error', message: 'Invalid role.' });
  }

  // Insert user into the `User` table
  const userQuery = 'INSERT INTO User (username, email, password, role) VALUES (?, ?, ?, ?)';
  connection.query(userQuery, [username, email, password, role], (err, results) => {
    if (err) {
      console.error('Database error (insert user):', err);
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }

    const userId = results.insertId;

    let insertRoleQuery = '';
    const queryParams = [];

    if (role === 'student') {
      // Validate and prepare student details
      if (
        !studentDetails ||
        !studentDetails.name || 
        !studentDetails.dob || 
        !studentDetails.roll_no || 
        !studentDetails.semester || 
        !studentDetails.academic_year || 
        !studentDetails.current_status
      ) {
        return res.status(400).json({ status: 'error', message: 'Missing or incomplete student details.' });
      }

      insertRoleQuery = `
        INSERT INTO Student (student_id, name, dob, roll_no, semester, academic_year, current_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      queryParams.push(
        userId,
        studentDetails.name, 
        studentDetails.dob,
        studentDetails.roll_no,
        studentDetails.semester,
        studentDetails.academic_year,
        studentDetails.current_status
      );
    }

    if (role === 'teacher') {
      // Validate and prepare teacher details
      if (!teacherDetails || !teacherDetails.name) {
        return res.status(400).json({ status: 'error', message: 'Missing teacher details.' });
      }

      insertRoleQuery = 'INSERT INTO Teacher (teacher_id, name) VALUES (?, ?)';
      queryParams.push(userId, teacherDetails.name);
    }

    if (role === 'admin') {
      // Validate and prepare admin details
      if (!adminDetails || !adminDetails.name || !adminDetails.role) {
        return res.status(400).json({ status: 'error', message: 'Missing admin details.' });
      }

      insertRoleQuery = 'INSERT INTO Admin (admin_id, name, role) VALUES (?, ?, ?)';
      queryParams.push(userId, adminDetails.name, adminDetails.role);
    }

    // Insert into the role-specific table
    if (insertRoleQuery) {
      connection.query(insertRoleQuery, queryParams, (err) => {
        if (err) {
          console.error('Database error (insert role-specific data):', err);
          return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }

        res.status(201).json({ status: 'success', message: `${role.charAt(0).toUpperCase() + role.slice(1)} added successfully.` });
      });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid role-specific logic.' });
    }
  });
});


//delete user
router.delete('/users/delete', (req, res) => {
  const userId = req.headers['user-id'];  // Access the 'user-id' from headers

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User ID is required' });
  }

  const query = 'DELETE FROM User WHERE user_id = ?';

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  });
});


module.exports = router;
