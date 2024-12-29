const Task = require('../models/Task');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, startTime, endTime, priority,status } = req.body;
    console.log(req);
    const task = new Task({
      userId: req.user.id,
      title,
      startTime,
      endTime,
      priority,
      status
    });
    await task.save();
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Tasks with Filters and Sorting
exports.getTasks = async (req, res) => {
  try {
    const { priority, status, sortBy } = req.query;
    const filter = { userId: req.user.id };
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const sortOptions = {};
    if (sortBy === 'startTime') sortOptions.startTime = 1;
    if (sortBy === 'endTime') sortOptions.endTime = 1;

    const tasks = await Task.find(filter).sort(sortOptions);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === 'finished') {
      updates.endTime = new Date();
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.status === 'finished').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;

    const pendingStats = tasks
      .filter(task => task.status === 'pending')
      .reduce((stats, task) => {
        const lapsedTime = Math.max(0, (Date.now() - new Date(task.startTime)) / 3600000);
        const balanceTime = Math.max(0, (new Date(task.endTime) - Date.now()) / 3600000);
        stats.totalLapsed += lapsedTime;
        stats.totalBalance += balanceTime;
        return stats;
      }, { totalLapsed: 0, totalBalance: 0 });

    const completedAvgTime = tasks
      .filter(task => task.status === 'finished')
      .reduce((total, task) => total + (new Date(task.endTime) - new Date(task.startTime)) / 3600000, 0) / (completedTasks || 1);

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedPercent: (completedTasks / totalTasks) * 100,
        pendingPercent: (pendingTasks / totalTasks) * 100,
        pendingStats,
        completedAvgTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
