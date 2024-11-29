import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ErrorPage from './Pages/ErrorPage';
import ProtectedRoute from './Services/ProtectedRoute';
// Lazy Loading Pages
const LoginPage = lazy(() => import('./Pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./Pages/ForgotPasswordPage'));
const RequestAdminPage = lazy(() => import('./Pages/RequestAdminPage'));
const AdminDashboard = lazy(() => import('./Pages/AdminDashboard'));
const TeacherDashboard = lazy(() => import('./Pages/ProfessorDashboard'));
const StudentDashboard = lazy(() => import('./Pages/StudentDashboard'));
const ProfilePage = lazy(() => import('./Pages/ProfilePage'));
const CoursePage = lazy(() => import('./Pages/CoursePage'));

function App() {
  const [user, setUser] = useState(null);
  const [serverAvailable, setServerAvailable] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        if (response.status === 200 || response.data.status === 'ok') {
          setServerAvailable(true);
        } else {
          setServerAvailable(false);
        }
      } catch (error) {
        console.error('Error checking server health:', error);
        setServerAvailable(false);
      }
    };
    checkServerHealth();
  }, []);
  const PrivateRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/" replace />;
    if (user.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  if (serverAvailable === null) {
    return <div>Checking server health...</div>;
  }
  if (!serverAvailable) {
    return <ErrorPage />;
  }
  return (
    <Router>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={
                <ProtectedRoute user={user}>
                <LoginPage setUser={setUser} />
              </ProtectedRoute>
              } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/request-admin" element={<RequestAdminPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard user={user} />
                </PrivateRoute>
              }
            />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route
              path="/professor-dashboard"
              element={
                <PrivateRoute role="teacher">
                  <TeacherDashboard user={user} />
                </PrivateRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <PrivateRoute role="student">
                  <StudentDashboard user={user} />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </motion.div>
    </Router>
  );
}

export default App;