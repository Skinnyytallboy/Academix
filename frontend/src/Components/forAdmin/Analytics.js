import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { FaUsers, FaChalkboardTeacher, FaBuilding, FaBook } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = () => {
  const stats = [
    { label: 'Total Users', value: 1000, icon: <FaUsers /> },
    { label: 'Total Students', value: 700, icon: <FaUsers /> },
    { label: 'Total Professors', value: 50, icon: <FaChalkboardTeacher /> },
    { label: 'Total Admin Members', value: 20, icon: <FaBuilding /> },
    { label: 'Total Courses Offered', value: 100, icon: <FaBook /> },
    { label: 'Total Departments', value: 10, icon: <FaBuilding /> },
  ];

  const studentStats = {
    labels: ['Active', 'Inactive', 'Suspended', 'Graduated'],
    datasets: [
      {
        data: [400, 200, 50, 50],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
        borderWidth: 1,
      },
    ],
  };

  const courseStats = {
    labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4'],
    datasets: [
      {
        label: 'Professors per Course',
        data: [10, 8, 15, 7],
        backgroundColor: ['#673AB7', '#E91E63', '#FF9800', '#3F51B5'],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Analytics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 bg-indigo-950 text-white rounded-lg shadow-md flex flex-col items-center justify-center text-sm hover:scale-105 transition-transform duration-200"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <h3 className="font-medium">{stat.label}</h3>
            <p className="text-lg font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
      <div className="bg-indigo-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">Student Statistics</h3>
          <div className="flex justify-center items-center h-72">
            <Pie data={studentStats} options={{ responsive: true }} />
          </div>
        </div>
        <div className="bg-indigo-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Professors Teaching Courses</h3>
          <div className="h-72">
            <Bar
              data={courseStats}
              options={{
                responsive: true,
                plugins: { legend: { position: 'top' } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
