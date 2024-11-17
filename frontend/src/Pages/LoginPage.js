import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../Services/api';
import mainLogo from '../assets/pngs/main.png';

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const checkServerAvailability = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setServerError(false);
        } else {
          setServerError(true);
        }
      } catch (error) {
        setServerError(true);
        console.error("Error checking server availability:", error);
      }
    };
    checkServerAvailability();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (serverError) {
      setError("Server unavailable. Please try again later.");
      setShowToast(true);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (userData.role === 'teacher') {
          navigate('/professor-dashboard');
        } else if (userData.role === 'student') {
          navigate('/student-dashboard');
        } else {
          setError("Invalid role detected.");
          setShowToast(true);
        }
      } else {
        setError("Invalid credentials. Please try again.");
        setShowToast(true);
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
      setShowToast(true);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);
  if (serverError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-xl font-semibold text-red-600">Server Unavailable</h1>
          <p className="mt-4 text-gray-700">
            The backend server is currently unavailable. Please check back later.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-center mb-6">
          <img src={mainLogo} alt="Logo" className="w-45 h-35" />
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-7 right-0 flex items-center px-5 text-gray-500"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">Forgot Password?</a>
        </div>
        <div className="mt-4 text-center">
          <a
            href="/request-admin"
            className="w-full px-4 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            Contact for Classroom
          </a>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-indigo-950 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
export default LoginPage;