const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.post('/assign-assignment', (req, res) => {
    const { courseId, assignmentTitle, assignmentDescription, dueDate, assignDate, link, fileType, filePhys } = req.body;
    if (!courseId || !assignmentTitle || !assignmentDescription || !dueDate || !assignDate) {
        return res.status(400).json({
            status: 'error',
            message: 'Course ID, Title, Description, Due Date, Assign Date are required. Error from Backend'
        });
    }
    const query = `
        INSERT INTO Assignment (course_id, title, description, due_date, assign_date, file_url, file_type, file_phys) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    connection.query(query, [courseId, assignmentTitle, assignmentDescription, dueDate, assignDate, link, fileType, filePhys], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error.',
                error: err.message
            });
        }
        return res.status(201).json({
            status: 'success',
            message: 'Assignment created successfully.'
        });
    });
});



module.exports = router;