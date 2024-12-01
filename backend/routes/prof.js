const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Using async/await properly with db.query
router.get('/assignments', async (req, res) => {
    try {
        const userID = req.headers['user-id'];
        if (!userID) {
            return res.status(400).json({ error: 'UserID is required.' });
        }

        // Promise-based query function (if db.query does not return a promise)
        const query = `
            SELECT DISTINCT
                c.course_name AS course,
                a.title AS title,
                DATE_FORMAT(a.due_date, '%Y-%m-%d') AS dueDate,
                t.name AS teacher
            FROM 
                User u
            LEFT JOIN 
                Teacher t ON u.user_id = t.teacher_id
            LEFT JOIN 
                Teacher_Courses tc ON t.teacher_id = tc.teacher_id
            LEFT JOIN 
                Courses c ON tc.course_id = c.course_id
            LEFT JOIN 
                Assignment a ON a.course_id = c.course_id
            WHERE 
                u.user_id = ?
            ORDER BY 
                a.due_date DESC;
        `;

        // Using promise to work with async/await
        const results = await new Promise((resolve, reject) => {
            db.query(query, [userID], (err, results) => {
                if (err) {
                    reject(err); // Reject if there's an error in the query
                } else {
                    resolve(results); // Resolve with results if no error
                }
            });
        });

        if (results.length === 0) {
            return res.status(404).json({ message: 'No assignments found for the user.' });
        }

        res.status(200).json({ status: 'success', assignmentsResult: results });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
