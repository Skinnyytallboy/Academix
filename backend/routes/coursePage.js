const express = require('express');
const router = express.Router();
const db = require('../config/db');

const parseJSON = (data) => {
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return [];
    }
};

router.get('/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    const userID = req.headers.userid;
    const userRole = req.headers.userrole;
    if (!userID || !userRole) {
        return res.status(400).json({ error: 'Invalid user information in headers.' });
    }
    let accessCheck;
    try {
        if (userRole === 'teacher') {
            const query = `
                SELECT teacher_id 
                FROM Teacher_Courses 
                WHERE course_id = ? AND teacher_id = ?`;
            db.query(query, [courseId, userID], async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error.' });
                }
                if (result.length === 0) {
                    return res.status(403).json({ error: 'Access forbidden to this course.' });
                }
                accessCheck = result[0]; 
                const courseQuery = `
                    SELECT course_id AS id, course_name AS name, description, announcements, content 
                    FROM Courses 
                    WHERE course_id = ?`;
                db.query(courseQuery, [courseId], (err, courseResult) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error.' });
                    }
                    if (courseResult.length === 0) {
                        return res.status(404).json({ error: 'Course not found.' });
                    }
                    const course = courseResult[0];
                    course.announcements = parseJSON(course.announcements); 
                    course.content = parseJSON(course.content); 
                    const studentsQuery = `
                        SELECT s.student_id, u.user_id, s.name AS studentName
                        FROM Enrollment e
                        JOIN Student s ON e.student_id = s.student_id
                        JOIN User u ON s.student_id = u.user_id
                        WHERE e.course_id = ?`;
                    db.query(studentsQuery, [courseId], (err, studentsResult) => {
                        if (err) {
                            return res.status(500).json({ error: 'Internal server error.' });
                        }
                        const students = studentsResult.map(student => ({
                            studentID: student.student_id,
                            userID: student.user_id,
                            studentName: student.studentName
                        }));
                        const teachersQuery = `
                            SELECT t.teacher_id, u.user_id, t.name AS teacherName
                            FROM Teacher_Courses tc
                            JOIN Teacher t ON tc.teacher_id = t.teacher_id
                            JOIN User u ON t.teacher_id = u.user_id
                            WHERE tc.course_id = ?`;
                        db.query(teachersQuery, [courseId], (err, teachersResult) => {
                            if (err) {
                                return res.status(500).json({ error: 'Internal server error.' });
                            }
                            const teachers = teachersResult.map(teacher => ({
                                teacherID: teacher.teacher_id,
                                userID: teacher.user_id,
                                teacherName: teacher.teacherName
                            }));
                            const chatQuery = `
                                SELECT c.chat_id, c.message, 
                                c.sent_at,
                                       CASE
                                           WHEN s.student_id IS NOT NULL THEN s.name
                                           WHEN t.teacher_id IS NOT NULL THEN t.name
                                           WHEN a.admin_id IS NOT NULL THEN a.name
                                       END AS senderName
                                FROM Chat c
                                JOIN User u ON c.sender_id = u.user_id
                                LEFT JOIN Student s ON u.user_id = s.student_id
                                LEFT JOIN Teacher t ON u.user_id = t.teacher_id
                                LEFT JOIN Admin a ON u.user_id = a.admin_id
                                WHERE c.course_id = ?
                                ORDER BY c.sent_at DESC
                                `;
                            db.query(chatQuery, [courseId], (err, chatResult) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Internal server error.' });
                                }
                                const chats = chatResult.map(chat => ({
                                    chatID: chat.chat_id,
                                    message: chat.message,
                                    senderName: chat.senderName,
                                    sentAt: chat.sent_at
                                }));
                                course.students = students.map(student => student.studentName);
                                course.teachers = teachers.map(teacher => teacher.teacherName);
                                res.json({
                                    Teacher: teachers,
                                    Student: students,
                                    courseContent: course,
                                    chatMessages: chats
                                });
                            });
                        });
                    });
                });
            });
        } else if (userRole === 'student') {
            const query = `
                SELECT student_id 
                FROM Enrollment 
                WHERE course_id = ? AND student_id = ?`;
            db.query(query, [courseId, userID], async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error.' });
                }
                if (result.length === 0) {
                    return res.status(403).json({ error: 'Access forbidden to this course.' });
                }
                accessCheck = result[0];
                const courseQuery = `
                    SELECT course_id AS id, course_name AS name, description, announcements, content 
                    FROM Courses 
                    WHERE course_id = ?`;
                db.query(courseQuery, [courseId], (err, courseResult) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error.' });
                    }
                    if (courseResult.length === 0) {
                        return res.status(404).json({ error: 'Course not found.' });
                    }
                    const course = courseResult[0];
                    course.announcements = parseJSON(course.announcements);
                    course.content = parseJSON(course.content);
                    const studentsQuery = `
                        SELECT s.student_id, u.user_id, s.name AS studentName
                        FROM Enrollment e
                        JOIN Student s ON e.student_id = s.student_id
                        JOIN User u ON s.student_id = u.user_id
                        WHERE e.course_id = ?`;
                    db.query(studentsQuery, [courseId], (err, studentsResult) => {
                        if (err) {
                            return res.status(500).json({ error: 'Internal server error.' });
                        }
                        const students = studentsResult.map(student => ({
                            studentID: student.student_id,
                            userID: student.user_id,
                            studentName: student.studentName
                        }));
                        const teachersQuery = `
                            SELECT t.teacher_id, u.user_id, t.name AS teacherName
                            FROM Teacher_Courses tc
                            JOIN Teacher t ON tc.teacher_id = t.teacher_id
                            JOIN User u ON t.teacher_id = u.user_id
                            WHERE tc.course_id = ?`;
                        db.query(teachersQuery, [courseId], (err, teachersResult) => {
                            if (err) {
                                return res.status(500).json({ error: 'Internal server error.' });
                            }
                            const teachers = teachersResult.map(teacher => ({
                                teacherID: teacher.teacher_id,
                                userID: teacher.user_id,
                                teacherName: teacher.teacherName
                            }));
                            const chatQuery = `
                                SELECT c.chat_id, c.message, c.sent_at, u.name AS senderName
                                FROM Chat c
                                JOIN User u ON c.sender_id = u.user_id
                                WHERE c.course_id = ?
                                ORDER BY c.sent_at DESC`;
                            db.query(chatQuery, [courseId], (err, chatResult) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Internal server error.' });
                                }
                                const chats = chatResult.map(chat => ({
                                    chatID: chat.chat_id,
                                    message: chat.message,
                                    senderName: chat.senderName,
                                    sentAt: chat.sent_at
                                }));
                                course.students = students.map(student => student.studentName);
                                course.teachers = teachers.map(teacher => teacher.teacherName);
                                res.json({
                                    Teacher: teachers,
                                    Student: students,
                                    courseContent: course,
                                    chatMessages: chats
                                });
                            });
                        });
                    });
                });
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/:courseId/chat', async (req, res) => {
    const courseId = req.params.courseId;
    const userID = req.headers.userid;
    const userRole = req.headers.userrole;

    if (!userID || !userRole) {
        return res.status(400).json({ error: 'Invalid user information in headers.' });
    }

    try {
        if (userRole === 'teacher' || userRole === 'student') {
            const { message } = req.body;
            const senderId = userID;  // assuming the user ID comes from headers

            // Insert the new message into the chat
            const query = `
                INSERT INTO Chat (course_id, sender_id, message, sent_at)
                VALUES (?, ?, ?, NOW())
            `;
            db.query(query, [courseId, senderId, message], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error.' });
                }
                res.status(201).json({ message: 'Message sent successfully.' });
            });
        } else {
            return res.status(403).json({ error: 'Access forbidden for this user role.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST for Content (Teacher only)
router.post('/:courseId/content', async (req, res) => {
    const courseId = req.params.courseId;
    const { content } = req.body; // Content to be posted
    const userID = req.headers.userid;
    const userRole = req.headers.userrole;

    if (!userID || !userRole || !content) {
        return res.status(400).json({ error: 'Invalid data or missing fields.' });
    }

    try {
        if (userRole !== 'teacher') {
            return res.status(403).json({ error: 'Only teachers can post content.' });
        }

        // Check if user is the teacher of the course
        const query = `
            SELECT teacher_id 
            FROM Teacher_Courses 
            WHERE course_id = ? AND teacher_id = ?`;
        db.query(query, [courseId, userID], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error.' });
            }
            if (result.length === 0) {
                return res.status(403).json({ error: 'Access forbidden to this course.' });
            }

            const updateContentQuery = `
                UPDATE Courses
                SET content = JSON_ARRAY_APPEND(content, '$', ?)
                WHERE course_id = ?`;

            db.query(updateContentQuery, [content, courseId], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error.' });
                }
                res.status(201).json({ message: 'Content posted successfully.' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// POST for Announcements (Teacher only)
router.post('/:courseId/announcement', async (req, res) => {
    const courseId = req.params.courseId;
    const { announcement } = req.body; // Announcement message
    const userID = req.headers.userid;
    const userRole = req.headers.userrole;

    if (!userID || !userRole || !announcement) {
        return res.status(400).json({ error: 'Invalid data or missing fields.' });
    }

    try {
        if (userRole !== 'teacher') {
            return res.status(403).json({ error: 'Only teachers can post announcements.' });
        }

        // Check if user is the teacher of the course
        const query = `
            SELECT teacher_id 
            FROM Teacher_Courses 
            WHERE course_id = ? AND teacher_id = ?`;
        db.query(query, [courseId, userID], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error.' });
            }
            if (result.length === 0) {
                return res.status(403).json({ error: 'Access forbidden to this course.' });
            }

            const updateAnnouncementQuery = `
                UPDATE Courses
                SET announcements = JSON_ARRAY_APPEND(announcements, '$', ?)
                WHERE course_id = ?`;

            db.query(updateAnnouncementQuery, [announcement, courseId], (err, updateResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error.' });
                }
                res.status(201).json({ message: 'Announcement posted successfully.' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;
