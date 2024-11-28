// backend/index.js
const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const countRoutes = require('./routes/countRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);       
app.use('/api/count', countRoutes);
app.use('/api/teacher', teacherRoutes); 

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

//const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
