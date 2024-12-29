import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="navbar">
        <h1>Task Manager</h1>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
      </header>

      <main className="welcome-section">
        <h2>Welcome to the Task Manager</h2>
        <p>Manage your tasks efficiently and track your progress.</p>
        <div className="actions">
          <Link to="/register" className="btn">Get Started</Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
