// backend/index.js
const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const countRoutes = require('./routes/countRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const userManagmentRoutes = require('./routes/userManagementRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignStudentsRoute = require('./routes/assignStudentsRoute');
const gradeSubmissionRoute = require('./routes/gradeSubmissionRoute');
const studentGradesRoute = require('./routes/studentGradesRoute');
const studentRoutes = require('./routes/studentRoutes');
const coursePage = require('./routes/coursePage');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);       
app.use('/api/count', countRoutes);
app.use('/api/teacher', teacherRoutes); 
app.use('/api/admin', userManagmentRoutes);
app.use('/api/Acourse', courseRoutes);
app.use('/api/assignStudents', assignStudentsRoute);
app.use('/api/gradeSubmission', gradeSubmissionRoute);
app.use('/api/studentGrades', studentGradesRoute);
app.use('/api/student', studentRoutes);
app.use('/api/CoursePage', coursePage);


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

//const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
