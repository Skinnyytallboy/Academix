const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/courses', async (req, res) => {
  try {
    const userID = req.headers['user-id'];
    if (!userID) {
      return res.status(400).json({ error: 'UserID is required.' });
    }

    const query = `
        SELECT 
            c.course_id, 
            c.course_name, 
            c.description
        FROM Courses c
        JOIN Teacher_Courses e ON c.course_id = e.course_id
        JOIN Teacher s ON e.teacher_id = s.teacher_id
        JOIN User u ON s.teacher_id = u.user_id
        WHERE u.user_id = ?;
    `;
    connection.query(query, [userID], (err, results) => {  // Changed db.query to connection.query
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No available courses found for the user.' });
      }

      res.status(200).json({ status: 'success', availableCourses: results });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
