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
      return res.status(204).json({ status: 'success', message: 'No courses found.' });
    }

    res.status(200).json({ status: 'success', cour: results });
  });
});


router.get('/assignments', (req, res) => {

  const courseId = req.headers['courseid'];

  console.log("courseee", courseId);
  if (!courseId) {
    return res.status(400).json({ status: 'error', message: 'Course ID is required.' });
  }

  const query = `SELECT assignment_id, title FROM Assignment WHERE course_id = ?`;

  connection.query(query, [courseId], (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No assignments found for this course.' });
    }
    res.status(200).json({ status: 'success', assignments: results });
  });
});

router.get('/submissions', (req, res) => {

    const assignmentId = req.headers['assignmentid'];
  
    if (!assignmentId) {
      return res.status(400).json({ status: 'error', message: 'Assignment ID is required in the headers.' });
    }
  
    const query = `
      SELECT 
        s.submission_id, 
        st.name AS student_name, 
        s.status, 
        s.plagiarism_score, 
        s.file_url, 
        g.score AS grade, 
        g.feedback 
      FROM 
        Submission s
        INNER JOIN Student st ON s.student_id = st.student_id
        LEFT JOIN Grades g ON s.submission_id = g.submission_id
      WHERE 
        s.assignment_id = ?
    `;
  
    connection.query(query, [assignmentId], (err, results) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No submissions found for this assignment.' });
      }
      console.log('Query results:', results); 
      res.status(200).json({ status: 'success', submissions: results });
    });
});
  

router.put('/grade', (req, res) => {
    const { submissionId, teacherId, grade, feedback } = req.body;
  
    // Basic validation
    if (!submissionId || !teacherId || grade === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID, Teacher ID, and Grade are required.'
      });
    }
  
    // Query for inserting or updating the grade
    const query = `
      INSERT INTO Grades (submission_id, teacher_id, score, feedback, graded_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
        score = VALUES(score), 
        feedback = VALUES(feedback), 
        graded_at = VALUES(graded_at)
    `;
  
    connection.query(query, [submissionId, teacherId, grade, feedback || null], (err, result) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Grade recorded successfully.'
      });
    });
  });
  

module.exports = router;