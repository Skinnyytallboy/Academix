const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
    const queries = {
        Users: 'SELECT COUNT(*) AS totalUsers FROM User',
        students: 'SELECT COUNT(*) AS totalStudents FROM Student',
        teachers: 'SELECT COUNT(*) AS totalTeachers FROM Teacher',
        admins: 'SELECT COUNT(*) AS totalAdmins FROM Admin',
        courses: 'SELECT COUNT(*) AS totalCourses FROM Courses',
        activeStudents: 'SELECT COUNT(*) AS activeStudents FROM Student WHERE current_status = "Active"',
        inactiveStudents: 'SELECT COUNT(*) AS inactiveStudents FROM Student WHERE current_status = "Inactive"',
        suspendedStudents: 'SELECT COUNT(*) AS suspendedStudents FROM Student WHERE current_status = "Suspended"',
        graduatedStudents: 'SELECT COUNT(*) AS graduatedStudents FROM Student WHERE current_status = "Graduated"',
        professorsPerCourse: `
            SELECT c.course_name, COUNT(tc.teacher_id) AS professorCount
            FROM Courses c
            LEFT JOIN Teacher_Courses tc ON c.course_id = tc.course_id
            GROUP BY c.course_id, c.course_name
            ORDER BY professorCount DESC;
        `,
    };

    const fetchData = (query) => {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    // Execute all queries in parallel
    Promise.all([
        fetchData(queries.Users),
        fetchData(queries.students),
        fetchData(queries.teachers),
        fetchData(queries.admins),
        fetchData(queries.courses),
        fetchData(queries.activeStudents),
        fetchData(queries.inactiveStudents),
        fetchData(queries.suspendedStudents),
        fetchData(queries.graduatedStudents),
        fetchData(queries.professorsPerCourse),
    ])
    .then(([
        Users,
        students,
        teachers,
        admins,
        courses,
        activeStudents,
        inactiveStudents,
        suspendedStudents,
        graduatedStudents,
        professorsPerCourse,
    ]) => {
        const data = {
            totalUsers: Users[0].totalUsers,
            totalStudents: students[0].totalStudents,
            totalTeachers: teachers[0].totalTeachers,
            totalAdmins: admins[0].totalAdmins,
            totalCourses: courses[0].totalCourses,
            activeStudents: activeStudents[0].activeStudents,
            inactiveStudents: inactiveStudents[0].inactiveStudents,
            suspendedStudents: suspendedStudents[0].suspendedStudents,
            graduatedStudents: graduatedStudents[0].graduatedStudents,
            professorsPerCourse: professorsPerCourse.map(row => ({
                courseName: row.course_name,
                professorCount: row.professorCount,
            })),
        };
        res.status(200).json({ status: 'success', data });
    })
    .catch((err) => {
        console.error('Error fetching data:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch data' });
    });
});

module.exports = router;
