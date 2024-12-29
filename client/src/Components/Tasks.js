import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    startTime: '',
    endTime: '',
    priority: '',
    status: 'pending',
  });
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data } = await axios.get('/tasks', { headers: getAuthHeaders() });
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  // Add a new task
  const addTask = async () => {
    const { title, startTime, endTime, priority, status } = newTask;

    // Input validation
    if (!title || !startTime || !endTime || !priority || !status) {
      setError('Please fill out all fields before adding a task.');
      return;
    }

    try {
      await axios.post('/tasks', newTask, { headers: getAuthHeaders() });
      setNewTask({
        title: '',
        startTime: '',
        endTime: '',
        priority: '',
        status: 'pending',
      }); // Reset form fields
      fetchTasks();
      fetchTaskStats(); // Update stats
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`, { headers: getAuthHeaders() });
      fetchTasks();
      fetchTaskStats(); // Update stats
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  // Fetch task stats
  const fetchTaskStats = async () => {
    try {
      const { data } = await axios.get('/tasks/stats', { headers: getAuthHeaders() });
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task stats');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTaskStats();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Task Manager</h2>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Add New Task */}
      <div style={styles.formContainer}>
        <h3>Create New Task</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={newTask.startTime}
          onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={newTask.endTime}
          onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Priority (1-5)"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          style={styles.input}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          style={styles.input}
        >
          <option value="pending">Pending</option>
          <option value="finished">Completed</option>
        </select>
        <button onClick={addTask} style={styles.button}>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul style={styles.taskList}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} style={styles.taskItem}>
              <div>
                <strong>{task.title}</strong>
                <p>Priority: {task.priority}</p>
                <p>Status: {task.status}</p>
                <p>
                  Start: {new Date(task.startTime).toLocaleString()} | End: {new Date(task.endTime).toLocaleString()}
                </p>
              </div>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No tasks found. Add a new task to get started!</p>
        )}
      </ul>

      {/* Task Stats */}
      {stats && (
        <div style={styles.statsContainer}>
          <h3>Task Summary</h3>
          <p>Total Tasks: {stats.totalTasks}</p>
          <p>Completed: {stats.completedPercent}%</p>
          <p>Pending: {stats.pendingPercent}%</p>
          <div>
            <h4>Pending Details</h4>
            <p>Total Lapsed: {stats.pendingStats?.totalLapsed.toFixed(2)}</p>
            <p>Total Balance: {stats.pendingStats?.totalBalance.toFixed(2)}</p>
          </div>
          {stats.completedAvgTime > 0 && (
            <p>Average Completion Time: {stats.completedAvgTime.toFixed(2)} hours</p>
          )}
        </div>
      )}
    </div>
  );
};

// Styling
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  error: {
    color: 'red',
  },
  formContainer: {
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    marginRight: '10px',
    marginBottom: '10px',
    width: '200px',
  },
  button: {
    padding: '8px 15px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  statsContainer: {
    marginTop: '20px',
  },
};

export default Tasks;
