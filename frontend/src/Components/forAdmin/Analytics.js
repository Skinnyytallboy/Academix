import React, { useEffect, useState } from 'react';
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
import { getCount } from '../../Services/api';
import { ClipLoader } from 'react-spinners'; // Import a spinner library

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
  }
  return colors;
};

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const [studentStats, setStudentStats] = useState({
    labels: ['Active', 'Inactive', 'Suspended', 'Graduated'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
        borderWidth: 1,
      },
    ],
  });
  const [professorsPerCourse, setProfessorsPerCourse] = useState({
    labels: [],
    datasets: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true
      const response = await getCount();
      if (response.status === 'success') {
        const data = response.data;

        // Update stats for the cards
        setStats([
          { label: 'Total Users', value: data.totalUsers, icon: <FaUsers /> },
          { label: 'Total Students', value: data.totalStudents, icon: <FaUsers /> },
          { label: 'Total Professors', value: data.totalTeachers, icon: <FaChalkboardTeacher /> },
          { label: 'Total Admin Members', value: data.totalAdmins, icon: <FaBuilding /> },
          { label: 'Total Courses Offered', value: data.totalCourses, icon: <FaBook /> },
        ]);

        // Update student statistics for the pie chart
        setStudentStats({
          labels: ['Active', 'Inactive', 'Suspended', 'Graduated'],
          datasets: [
            {
              data: [
                data.activeStudents,
                data.inactiveStudents,
                data.suspendedStudents,
                data.graduatedStudents,
              ],
              backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3'],
              borderWidth: 1,
            },
          ],
        });

        // Update professors per course chart
        const courseNames = data.professorsPerCourse.map((course) => course.courseName);
        const professorCounts = data.professorsPerCourse.map((course) => course.professorCount);

        setProfessorsPerCourse({
          labels: courseNames,
          datasets: [
            {
              label: 'Professors per Course',
              data: professorCounts,
              backgroundColor: generateColors(courseNames.length),
            },
          ],
        });
      }
      setLoading(false); // Set loading to false
    };

    fetchData();
  }, []);

  const filteredCourses = professorsPerCourse.labels.filter((courseName) =>
    courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredData = professorsPerCourse.datasets.length
    ? professorsPerCourse.datasets[0].data.filter((_, index) =>
        professorsPerCourse.labels[index].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg space-y-6">
      {loading ? ( // Show loader when loading
        <div className="flex justify-center items-center h-72">
          <ClipLoader size={50} color="#4A90E2" />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Analytics</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-700">Professors Teaching Courses</h3>
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 text-sm"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="h-72 overflow-y-auto">
                <Bar
                  data={{
                    labels: filteredCourses,
                    datasets: [
                      {
                        label: 'Professors per Course',
                        data: filteredData,
                        backgroundColor: generateColors(filteredCourses.length),
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: 'top' } },
                    scales: {
                      x: { beginAtZero: true },
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
