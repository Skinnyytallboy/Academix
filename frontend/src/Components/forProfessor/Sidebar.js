import React, { useState } from 'react';
import { FaBars, FaUserCog, FaChartPie, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const tabs = [
    { name: 'ManageUsers', icon: <FaUserFriends /> },
    { name: 'Requests', icon: <FaUserCog /> },
    { name: 'Analytics', icon: <FaChartPie /> },
  ];

  return (
    <div
      className={`h-full bg-indigo-950 text-white transition-width duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-900">
        {!isCollapsed && <h1 className="text-xl font-bold">Admin Dashboard</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-gray-300 transition">
          <FaBars size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-4 w-full px-4 py-3 text-left transition duration-200 ease-in-out ${
                activeTab === tab.name
                  ? 'bg-indigo-800 text-gray-100 font-semibold'
                  : 'hover:bg-indigo-900 hover:text-gray-200'
              }`} >
            <span className="text-lg">{tab.icon}</span>
            {!isCollapsed && <span>{tab.name}</span>}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-indigo-900">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-indigo-900 hover:text-gray-300 transition">
            {!isCollapsed ? 'Logout' : <FaSignOutAlt />}
          </button>
        </div>
    </div>
  );
};

export default Sidebar;
