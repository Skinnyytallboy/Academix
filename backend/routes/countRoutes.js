const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
    const queries = {
        students: 'SELECT COUNT(*) AS totalStudents FROM Student',
        teachers: 'SELECT COUNT(*) AS totalTeachers FROM Teacher',
        admins: 'SELECT COUNT(*) AS totalAdmins FROM Admin',
        courses: 'SELECT COUNT(*) AS totalCourses FROM Courses',
        departments: 'SELECT COUNT(*) AS totalDepartments FROM Department',
    };

    const fetchData = (query) => {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    };

    // Execute all queries in parallel
    Promise.all([
        fetchData(queries.students),
        fetchData(queries.teachers),
        fetchData(queries.admins),
        fetchData(queries.courses),
        fetchData(queries.departments),
    ])
    .then(([students, teachers, admins, courses, departments]) => {
        const data = {
            totalStudents: students.totalStudents,
            totalTeachers: teachers.totalTeachers,
            totalAdmins: admins.totalAdmins,
            totalCourses: courses.totalCourses,
            totalDepartments: departments.totalDepartments,
        };
        res.status(200).json({ status: 'success', data });
    })
    .catch((err) => {
        console.error('Error fetching data:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch data' });
    });
}
);

module.exports = router;
