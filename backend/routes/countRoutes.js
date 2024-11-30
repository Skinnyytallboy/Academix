const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
    const queries = {
        students: 'SELECT COUNT(*) AS totalStudents FROM Student',
        teachers: 'SELECT COUNT(*) AS totalTeachers FROM Teacher',
        admins: 'SELECT COUNT(*) AS totalAdmins FROM Admin',
        courses: 'SELECT COUNT(*) AS totalCourses FROM Courses',
        studentStatus: `
            SELECT 
                current_status, COUNT(*) AS count 
            FROM Student 
            GROUP BY current_status
        `,
        professorCourses: `
            SELECT 
                Courses.course_name, COUNT(Teacher_Courses.teacher_id) AS professorsPerCourse
            FROM Teacher_Courses
            JOIN Courses ON Teacher_Courses.course_id = Courses.course_id
            GROUP BY Courses.course_name
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
        fetchData(queries.students),
        fetchData(queries.teachers),
        fetchData(queries.admins),
        fetchData(queries.courses),
        fetchData(queries.studentStatus),
        fetchData(queries.professorCourses),
    ])
    .then(([students, teachers, admins, courses, studentStatus, professorCourses]) => {
        const data = {
            totalStudents: students[0].totalStudents,
            totalTeachers: teachers[0].totalTeachers,
            totalAdmins: admins[0].totalAdmins,
            totalCourses: courses[0].totalCourses,
            studentStatus: studentStatus.reduce((acc, status) => {
                acc[status.current_status] = status.count;
                return acc;
            }, {}),
            professorCourses: professorCourses.map(course => ({
                courseName: course.course_name,
                professorsPerCourse: course.professorsPerCourse,
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
