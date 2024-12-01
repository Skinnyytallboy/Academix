const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// 1. Fetch all active students
router.get('/students', (req, res) => {
  const query = `SELECT student_id, name, roll_no FROM Student WHERE current_status = 'Active'`;
  //adding roll_no incase you need it warna remove it

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No active students found.' });
    }

    res.status(200).json({ status: 'success', students: results });
  });
});

// 2. Fetch all courses
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

// 3. Assign students to a course
router.post('/assign-students', (req, res) => {
  const { courseId, studentIds } = req.body;  // Ensure you're receiving an array of student IDs
  
  if (!courseId || !studentIds || studentIds.length === 0) {
    return res.status(400).json({ status: 'error', message: 'Course ID and student IDs are required.' });
  }

  // Prepare the values to be inserted into the Enrollment table
  const values = studentIds.map((studentId) => [courseId, studentId, 'Enrolled']);
  
  const query = `
    INSERT INTO Enrollment (course_id, student_id, status) 
    VALUES ?
  `;
  
  connection.query(query, [values], (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Internal server error.', error: err.message });
    }

    return res.status(201).json({
      status: 'success',
      message: `Successfully assigned ${studentIds.length} student(s) to course ID ${courseId}.`,
    });
  });
});
  

// 4. Remove a student from a course
router.delete('/remove-student', (req, res) => {
  const { courseId, studentId } = req.body;

  // Validate inputs
  if (!courseId || !studentId) {
    return res.status(400).json({ status: 'error', message: 'Course ID and student ID are required.' });
  }

  const query = `
    DELETE FROM Enrollment
    WHERE course_id = ? AND student_id = ?
  `;

  connection.query(query, [courseId, studentId], (err, result) => {
    if (err) {
      return result.status(500).json({ status: 'error', message: 'Internal server error.' });
    }

    if (result.affectedRows === 0) {
      return result.status(404).json({ status: 'error', message: 'Student not found in the course.' });
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully removed student ID ${studentId} from course ID ${courseId}.`,
    });
  });
});

module.exports = router;
