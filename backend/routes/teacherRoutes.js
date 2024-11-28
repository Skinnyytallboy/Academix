// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/courses', (req, res) => {
    const { teacherId } = req.headers; // Extract teacherId from headers (sent by the client)

    if (!teacherId) {
        return res.status(400).json({ status: 'error', message: 'Missing teacherId in the request.' });
    }

    const query = `
        SELECT 
            c.course_id, 
            c.CourseName, 
            c.Credit_hours, 
            d.Name AS DepartmentName
        FROM 
            Teacher_Courses tc
        INNER JOIN 
            Courses c ON tc.course_id = c.course_id
        INNER JOIN 
            Department d ON c.Department_id = d.department_id
        WHERE 
            tc.teacher_id = ?
    `;

    connection.query(query, [teacherId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No courses found for this teacher.' });
        }

        res.status(200).json({
            status: 'success',
            courses: results
        });
    });
});

module.exports = router;
