import React, { useState } from 'react';
import Sidebar from '../Components/forAdmin/Sidebar';
import Header from '../Components/forAdmin/Header';
import ManageUsers from '../Components/forAdmin/ManageUsers';
import Requests from '../Components/forAdmin/Requests';
import Analytics from '../Components/forAdmin/Analytics';


const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('ManageUsers');

  const renderContent = () => {
    switch (activeTab) {
      case 'ManageUsers':
        return <ManageUsers />;
      case 'Requests':
        return <Requests />;
      case 'Analytics':
        return <Analytics />;
      default:
        return <ManageUsers />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ">
        <Header user={user} />
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;