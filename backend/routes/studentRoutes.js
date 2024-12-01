const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/courses', async (req, res) => {
  try {
    const userID = req.headers['user-id'];
    if (!userID) {
      return res.status(400).json({ error: 'UserID is required.' });
    }

    const query = `
      SELECT 
        c.course_id, 
        c.course_name, 
        c.description, 
        e.status,
        CASE 
          WHEN e.status = 'Completed' THEN e.grade
          ELSE NULL
        END AS grade
      FROM Courses c
      JOIN Enrollment e ON c.course_id = e.course_id
      JOIN Student s ON e.student_id = s.student_id
      JOIN User u ON s.student_id = u.user_id
      WHERE u.user_id = ?;
    `;
    db.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No available courses found for the user.' });
      }

      res.status(200).json({ status: 'success' , availableCourses: results });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/pendingAssignments', async (req, res) => {
  try {
    const userID = req.headers['user-id'];
    if (!userID) {
      return res.status(400).json({ error: 'UserID is required.' });
    }

    const query = `
    SELECT 
    a.assignment_id, 
    a.course_id, 
    a.title, 
    a.description, 
    a.due_date
FROM Assignment a
JOIN Courses c ON c.course_id = a.course_id
JOIN Enrollment e ON e.course_id = c.course_id
JOIN Student s ON s.student_id = e.student_id
JOIN User u ON u.user_id = s.student_id
LEFT JOIN Submission ss ON a.assignment_id = ss.assignment_id AND ss.student_id = s.student_id
WHERE u.user_id = ? 
    AND e.status IN ('Enrolled', 'Incomplete') 
    AND (ss.status IS NULL OR ss.status = 'Not Submitted') 
    `;
    db.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No available assignments found for the user.' });
      }

      console.log('pending assignments', results);
      res.status(200).json({ status: 'success' , availableAssignments: results });
    });
  } catch (error) {
    console.error('Server error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/submitAssignment', async (req, res) => {
  try {
    const { assignmentId, userID, description, submissionContent, fileUrl } = req.body;
    if (!assignmentId || !userID || !description || !(submissionContent || fileUrl)) {
      return res.status(400).json({ error: 'AssignmentId, UserID, and either submission content or file URL are required.' });
    }
    const findStudentQuery = `
      SELECT s.student_id 
      FROM Student s
      JOIN User u ON u.user_id = s.student_id
      WHERE u.user_id = ?;
    `;
    db.query(findStudentQuery, [userID], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: 'Student not found for the given userID.' });
      }
      const studentId = results[0].student_id;
      const fileType = fileUrl ? 'application/pdf' : 'text/plain';
      const query = `
        INSERT INTO Submission (assignment_id, student_id, description, submitted_at, status, file_url, file_type)
        VALUES (?, ?, ?, NOW(), 'Submitted', ?, ?);
      `;
      const values = [
        assignmentId,
        studentId,
        description,
        fileUrl || (null),
        fileType,
      ];
      db.query(query, values, (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({ error: 'Failed to submit the assignment.' });
        }
        res.status(200).json({ status: 'success', message: 'Assignment submitted successfully.' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetchAllStudentAssignments', async (req, res) => {
  try {
    const userID = req.headers['user-id'];
    if (!userID) {
      return res.status(400).json({ error: 'UserID is required.' });
    }

    const query = `
     SELECT 
         c.course_name AS course, 
         a.title AS title, 
         DATE_FORMAT(a.due_date, '%Y-%m-%d') AS dueDate, 
         t.name AS teacher
     FROM 
         Courses c
     JOIN 
         Enrollment e ON e.course_id = c.course_id
     JOIN 
         Assignment a ON a.course_id = c.course_id
     JOIN 
         Teacher_Courses tc ON tc.course_id = c.course_id
     JOIN 
         Teacher t ON t.teacher_id = tc.teacher_id
     JOIN 
         Student st ON st.student_id = e.student_id
     JOIN 
         User u ON u.user_id = st.student_id
     WHERE 
         u.user_id = ?
         AND e.status NOT IN ('Withdrawn', 'Completed')
     ORDER BY 
         a.due_date DESC;
    `;
    db.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No assignments found for the user.' });
      }

      res.status(200).json({ status: 'success' , assignments: results });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetchAssignmentDetails', async (req, res) => {
  try {
    const userID = req.headers['user-id'];
    if (!userID) {
      return res.status(400).json({ error: 'UserID is required.' });
    }
    const findStudentQuery = `
      SELECT s.student_id 
      FROM Student s
      JOIN User u ON u.user_id = s.student_id
      WHERE u.user_id = ?;
    `;
    db.query(findStudentQuery, [userID], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Student not found for the given user ID.' });
      }
      const studentId = results[0].student_id;
      const query = `
        SELECT 
            a.assignment_id AS assignmentId,
            c.course_name AS course,
            a.title,
            a.description,
            DATE_FORMAT(a.due_date, '%Y-%m-%d') AS dueDate,
            a.assign_date AS assignDate,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'studentId', s.student_id,
                    'status', s.status,
                    'submittedAt', s.submitted_at,
                    'fileUrl', s.file_url,
                    'plagiarismScore', s.plagiarism_score,
                    'grade', g.score
                )
            ) AS submissions
        FROM 
            Courses c
        JOIN 
            Enrollment e ON c.course_id = e.course_id
        JOIN 
            Assignment a ON a.course_id = c.course_id
        LEFT JOIN 
            Submission s ON s.assignment_id = a.assignment_id AND s.student_id = e.student_id
        LEFT JOIN 
            Grades g ON g.submission_id = s.submission_id
        WHERE 
            e.student_id = ?
            AND e.status NOT IN ('Withdrawn', 'Completed')
        GROUP BY 
            a.assignment_id, 
            c.course_name, 
            a.title, 
            a.description, 
            a.due_date, 
            a.assign_date
        ORDER BY 
            c.course_name, 
            a.due_date;
      `;
      db.query(query, [studentId], (err, assignments) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({
          status: 'success',
          message: 'Assignments fetched successfully',
          assignments: assignments
        });
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;