const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/courses', (req, res) => {
    console.log('Headers received:', req.headers); // Log all headers

    const teacherId = req.headers['teacherid']; // Use lowercase key for headers
    console.log('Extracted teacherId:', teacherId); // Log extracted teacherId

    if (!teacherId) {
        console.log('No teacherId found in headers.');
        return res.status(400).json({ status: 'error', message: 'Missing teacherId in the request.' });
    }

    const query = `
      SELECT 
        c.course_id, 
        c.course_name, 
        c.credit_hours, 
        d.name AS DepartmentName
      FROM 
        Teacher_Courses tc
      INNER JOIN 
        Courses c ON tc.course_id = c.course_id
      INNER JOIN 
        Department d ON c.Department_id = d.department_id
      WHERE 
        tc.teacher_id = ?
    `;
    console.log('Executing query with teacherId:', teacherId); // Log query execution

    connection.query(query, [teacherId], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log database errors
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }

        if (results.length === 0) {
            console.log('No courses found for teacherId:', teacherId);
            return res.status(404).json({ status: 'error', message: 'No courses found for this teacher.' });
        }

        console.log('Query successful, results:', results); // Log query results
        res.status(200).json({
            status: 'success',
            courses: results,
        });
    });
});

module.exports = router;