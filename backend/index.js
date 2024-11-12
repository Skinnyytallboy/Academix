// backend/index.js
const express = require('express');
const connection = require('./config/db');
const app = express();

app.use(express.json());

// Sample route
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
