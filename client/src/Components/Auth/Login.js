import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://reunion-fkv4.onrender.com/api/auth/login', {
        email,
        password,
      });
      setMessage(`Login successful: ${response.data.message}`);
      localStorage.setItem('token', response.data.token); // Store token
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
