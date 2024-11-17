import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user }) => {
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" />;
    if (user.role === 'teacher') return <Navigate to="/professor-dashboard" />;
    if (user.role === 'student') return <Navigate to="/student-dashboard" />;
  }
  return children;
};

export default ProtectedRoute;
