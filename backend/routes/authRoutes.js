// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Missing email or password' });
    }
    const query = 'SELECT * FROM User WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
        const user = results[0];
        if (password !== user.password) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
        res.json({ status: 'success', userId: user.user_id, role: user.role });
    });
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const [user] = await db.execute(
//             'SELECT * FROM users WHERE email = ? AND password = ?',
//             [email, password]
//         );
//         if (!user || user.length === 0) {
//             return res.status(401).json({ status: 'error', message: 'Invalid credentials: mail error' });
//         }
//         const { role } = user[0];
//         res.json({ role });
//         res.status(200).json({ status: 'success', role: user.role });
//     } catch (error) {
//         res.status(500).json({ status: 'error', message: 'Internal server error : 500' });
//     }
// });

// module.exports = router;