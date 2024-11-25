import React, { useState } from 'react';
import Sidebar from '../Components/forAdmin/Sidebar';
import Header from '../Components/forAdmin/Header';
import ManageUsers from '../Components/forAdmin/ManageUsers';
import Requests from '../Components/Requests';
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


// import React from 'react';

// const AdminDashboard = ({ user }) => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded">
//         <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
//         <p>Welcome, {user.email}! You can manage accounts here.</p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
