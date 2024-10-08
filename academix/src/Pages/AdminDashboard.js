import React from 'react';

const AdminDashboard = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <p>Welcome, {user.email}! You can manage accounts here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
