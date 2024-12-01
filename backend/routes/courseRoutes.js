const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/existingCourses', (req, res) => {
    const query = `
        SELECT 
            Courses.course_id AS courseId, 
            Courses.course_name AS courseName, 
            Teacher.name AS professorName
        FROM 
            Courses
        JOIN 
            Teacher_Courses ON Courses.course_id = Teacher_Courses.course_id
        JOIN 
            Teacher ON Teacher_Courses.teacher_id = Teacher.teacher_id
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json({ message: 'Server Error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
        
        const response = results.map(course => ({
            course_name: course.courseName,
            course_id: course.courseId,
            teacher_name: course.professorName,
        }));

        res.status(200).json({ status: 'success', dataC: response });
    });
});


router.get('/allProfessors', (req, res) => {
    const query = 'SELECT * FROM Teacher';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Server Error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No professors found' });
        }
        const response = results.map(professor => ({
            professor_id: professor.teacher_id,
            professor_name: professor.name,
        }));

        res.status(200).json({ status: 'success', dataP: response });
    });
});

router.post('/addCourse', (req, res) => {
  const { course_name, description, teacher_id } = req.body;
  connection.query('SELECT * FROM Teacher WHERE teacher_id = ?', [teacher_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to check teacher' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    connection.query('INSERT INTO Courses (course_name, description) VALUES (?, ?)', [course_name, description],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to add course' });
        }
        const course_id = result.insertId;
        connection.query('INSERT INTO Teacher_Courses (course_id, teacher_id) VALUES (?, ?)',
          [course_id, teacher_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to assign course to teacher' });
            }
            res.status(201).json({ message: 'Course added successfully'});
          }
        );
      }
    );
  });
});


router.delete('/deleteCourse', (req, res) => {
    const courseID = req.headers['courseid'];
    if (!courseID) {
        return res.status(400).json({ message: 'Course ID is required' });
    }
    connection.query('DELETE FROM Courses WHERE course_id = ?', [courseID], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ status: 'success', message: 'Course deleted successfully' });
    });
});

module.exports = router;