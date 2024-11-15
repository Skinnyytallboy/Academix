// frontend/Pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Services/api';

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      setUser(userData);

      // Navigate based on user role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'professor') {
        navigate('/professor-dashboard');
      } else if (userData.role === 'student') {
        navigate('/student-dashboard');
      }
    } catch (error) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;