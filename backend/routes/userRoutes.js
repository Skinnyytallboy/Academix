// backend/routes/userRoutes.js
const express = require('express');
const { getUsers, addUser } = require('../controllers/userController');
const { getAllData } = require('../controllers/allData'); 
const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/', getAllData);

module.exports = router;
