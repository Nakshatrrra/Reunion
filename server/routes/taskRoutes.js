const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, getDashboardStats } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/',authMiddleware, createTask);
router.get('/',authMiddleware, getTasks);
router.put('/:id',authMiddleware, updateTask);
router.delete('/:id',authMiddleware, deleteTask);
router.get('/stats',authMiddleware, getDashboardStats);

module.exports = router;
