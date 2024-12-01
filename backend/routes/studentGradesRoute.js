const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/courses', (req, res) => {
    const query = `SELECT course_id, course_name FROM Courses`;
  
    connection.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No courses found.' });
      }
  
      res.status(200).json({ status: 'success', courses: results });
    });
  });
  
  
  router.get('/Finalgrades', (req, res) => {
    const courseId = req.headers['courseid'];
  
    if (!courseId) {
      return res.status(400).json({ status: 'error', message: 'Course ID is required.' });
    }
  
    const query = `
      SELECT 
        st.name AS student_name,
        ass.title AS assignment_title,
        g.score AS assignment_score,
        e.grade AS final_grade
      FROM 
        Enrollment e
      JOIN 
        Student st ON e.student_id = st.student_id
      LEFT JOIN 
        Submission s ON e.student_id = s.student_id AND s.assignment_id IN (
          SELECT assignment_id FROM Assignment WHERE course_id = ?
        )
      LEFT JOIN 
        Grades g ON s.submission_id = g.submission_id
      LEFT JOIN 
        Assignment ass ON s.assignment_id = ass.assignment_id
      WHERE 
        e.course_id = ?
      ORDER BY 
        st.name, ass.assignment_id
    `;
  
    connection.query(query, [courseId, courseId], (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No grades found for this course.' });
      }
  
      // Transform the data to group by student
      const grades = {};
      results.forEach(row => {
        if (!grades[row.student_name]) {
          grades[row.student_name] = {
            student_name: row.student_name,
            assignments: [],
            final_grade: row.final_grade
          };
        }
  
        // Add assignment score only if it's available
        if (row.assignment_title) {
          grades[row.student_name].assignments.push({
            title: row.assignment_title,
            score: row.assignment_score
          });
        }
      });
  
      res.status(200).json({ status: 'success', grades: Object.values(grades) });
    });
  });
  
  module.exports = router;