// src/Pages/AdminDashboard.js

import React, { useState } from 'react';
import Sidebar from '../Components/forAdmin/Sidebar';
import Header from '../Components/forAdmin/Header';
import ManageUsers from '../Components/forAdmin/ManageUsers';
import Analytics from '../Components/forAdmin/Analytics';
import CourseManagement from '../Components/forAdmin/CourseManagement';
import AssignStudents from '../Components/forAdmin/AssignStudents';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('Manage Users');

  const renderContent = () => {
    switch (activeTab) {
      case 'Manage Users':
        return <ManageUsers />;
      case 'Analytics':
        return <Analytics />;
      case 'Course Management':
        return <CourseManagement />;
      case 'Assign Students': 
        return <AssignStudents />;
      default:
        return <ManageUsers />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <Header user={user} />
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
