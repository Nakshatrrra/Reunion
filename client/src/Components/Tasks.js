import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const { data } = await axios.get('/tasks', { headers: { Authorization: `Bearer ${token}` } });
    setTasks(data.tasks);
  };

  const addTask = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/tasks', { title: newTask }, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h3>Tasks</h3>
      <input type="text" placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
