import React from 'react';

const StudentDashboard = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
        <p>Welcome, {user.email}! You can view your courses here.</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
