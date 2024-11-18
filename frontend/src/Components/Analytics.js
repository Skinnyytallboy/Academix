import React from 'react';

const Analytics = () => {
  const stats = [
    { label: 'Total Users', value: 150 },
    { label: 'Pending Requests', value: 5 },
    { label: 'Active Professors', value: 40 },
    { label: 'Active Students', value: 100 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 border rounded-md shadow-md"
          >
            <h3 className="text-lg font-semibold">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
