import React from 'react';
import Sidebar from '../Components/forStudent/Sidebar';
import Header from '../Components/forStudent/Header';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ user }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header user={user} />
        <div className="p-4">
          <h2 className="text-2xl font-medium">Welcome to Your Dashboard, {user.username}!</h2>
          {/* Add student dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
