import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = ['ManageUsers', 'Requests', 'Analytics'];

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Admin Dashboard
      </div>
      <div className="flex-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 ${
              activeTab === tab ? 'bg-gray-700' : 'hover:bg-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
