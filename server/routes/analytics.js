const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTaskStats } = require('../controllers/analyticsController');

router.get('/', authMiddleware, getTaskStats);

module.exports = router;
