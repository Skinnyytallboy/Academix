const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/courses', (req, res) => {
  console.log('Headers received:', req.headers);

  const teacherId = req.headers['teacherid'];
  if (!teacherId) {
      console.log('No teacherId found in headers.');
      return res.status(400).json({ status: 'error', message: 'Missing teacherId in the request.' });
  }

  // Query 1: Get all courses for the teacher
  const coursesQuery = `
      SELECT course_id, course_name, announcements, content, description
      FROM Courses
      WHERE course_id IN (
          SELECT course_id
          FROM Teacher_Courses
          WHERE teacher_id = ?
      )
  `;

  connection.query(coursesQuery, [teacherId], (err, courses) => {
      if (err) {
          console.error('Database error (courses):', err);
          return res.status(500).json({ status: 'error', message: 'Internal server error.' });
      }

      if (courses.length === 0) {
          console.log('No courses found for teacherId:', teacherId);
          return res.status(404).json({ status: 'error', message: 'No courses found for this teacher.' });
      }

      const courseIds = courses.map(course => course.course_id); // Extract course IDs

      // Query 2: Get enrolled students for the courses (including their names)
      const enrollmentQuery = `
          SELECT e.course_id, e.student_id, s.name AS student_name
          FROM Enrollment e
          JOIN Student s ON e.student_id = s.student_id
          WHERE e.course_id IN (?)
      `;

      connection.query(enrollmentQuery, [courseIds], (err, enrollments) => {
          if (err) {
              console.error('Database error (enrollments):', err);
              return res.status(500).json({ status: 'error', message: 'Internal server error.' });
          }

          // Query 3: Get chat messages for the courses
          const chatQuery = `
              SELECT course_id, chat_id, sender_id, message, sent_at, video_call_url
              FROM Chat
              WHERE course_id IN (?)
          `;

          connection.query(chatQuery, [courseIds], (err, chats) => {
              if (err) {
                  console.error('Database error (chats):', err);
                  return res.status(500).json({ status: 'error', message: 'Internal server error.' });
              }

              // Query 4: Get teachers for the courses (including their names)
              const teacherQuery = `
                  SELECT tc.course_id, t.teacher_id, t.name AS teacher_name
                  FROM Teacher_Courses tc
                  INNER JOIN Teacher t ON tc.teacher_id = t.teacher_id
                  WHERE tc.course_id IN (?)
              `;

              connection.query(teacherQuery, [courseIds], (err, teachers) => {
                  if (err) {
                      console.error('Database error (teachers):', err);
                      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
                  }

                  // Compile the results into a single JSON object
                  const response = courses.map(course => {
                      return {
                          ...course,
                          enrolled_students: enrollments.filter(e => e.course_id === course.course_id).map(e => e.student_name),
                          chat_messages: chats.filter(c => c.course_id === course.course_id),
                          teachers: teachers.filter(t => t.course_id === course.course_id).map(t => t.teacher_name)
                      };
                  });

                  console.log('Query successful, response:', response);
                  res.status(200).json({ status: 'success', courses: response });
              });
          });
      });
  });
});

module.exports = router;

// router.get('/courses', (req, res) => {
//     console.log('Headers received:', req.headers); // Log all headers

//     const teacherId = req.headers['teacherid']; // Use lowercase key for headers
//     console.log('Extracted teacherId:', teacherId); // Log extracted teacherId

//     if (!teacherId) {
//         console.log('No teacherId found in headers.');
//         return res.status(400).json({ status: 'error', message: 'Missing teacherId in the request.' });
//     }

//     const query = `
//       SELECT 
//         c.course_id, 
//         c.course_name, 
//         c.credit_hours, 
//       FROM 
//         Teacher_Courses tc
//       INNER JOIN 
//         Courses c ON tc.course_id = c.course_id
//       WHERE 
//         tc.teacher_id = ?
//     `;
//     console.log('Executing query with teacherId:', teacherId); // Log query execution

//     connection.query(query, [teacherId], (err, results) => {
//         if (err) {
//             console.error('Database error:', err); // Log database errors
//             return res.status(500).json({ status: 'error', message: 'Internal server error.' });
//         }

//         if (results.length === 0) {
//             console.log('No courses found for teacherId:', teacherId);
//             return res.status(404).json({ status: 'error', message: 'No courses found for this teacher.' });
//         }

//         console.log('Query successful, results:', results); // Log query results
//         res.status(200).json({
//             status: 'success',
//             courses: results,
//         });
//     });
// });