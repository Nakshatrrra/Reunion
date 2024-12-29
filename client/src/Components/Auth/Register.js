import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // CSS for styling

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://reunion-fkv4.onrender.com/api/auth/register', {
        email,
        password,
      });
      setMessage(`Registration successful: ${response.data.message}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        
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
        <button type="submit">Register</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
