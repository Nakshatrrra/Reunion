const Task = require('../models/Task');

// Get Task Statistics
exports.getTaskStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const totalTasks = await Task.countDocuments({ user: userId });
        const completedTasks = await Task.countDocuments({ user: userId, status: 'finished' });
        const pendingTasks = totalTasks - completedTasks;

        const tasks = await Task.find({ user: userId });

        const pendingStats = tasks.reduce(
            (stats, task) => {
                if (task.status === 'pending') {
                    const now = new Date();
                    const startTime = new Date(task.startTime);
                    const endTime = new Date(task.endTime);

                    stats.timeLapsed += Math.max(0, (now - startTime) / (1000 * 60 * 60));
                    stats.timeLeft += Math.max(0, (endTime - now) / (1000 * 60 * 60));
                }
                return stats;
            },
            { timeLapsed: 0, timeLeft: 0 }
        );

        const completedStats = tasks.reduce(
            (total, task) =>
                task.status === 'finished'
                    ? total + (new Date(task.endTime) - new Date(task.startTime)) / (1000 * 60 * 60)
                    : total,
            0
        );

        const avgCompletionTime = completedTasks > 0 ? completedStats / completedTasks : 0;

        res.status(200).json({
            totalTasks,
            completedTasks,
            pendingTasks,
            pendingStats,
            avgCompletionTime,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
