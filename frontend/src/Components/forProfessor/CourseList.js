import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: 'Data Structures', description: 'Learn about arrays, stacks, queues, and more.' },
    { id: 2, name: 'Operating Systems', description: 'Introduction to OS concepts, including memory management.' },
    { id: 3, name: 'Database Systems', description: 'Explore the basics of database management and SQL.' },
  ];

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-8 text-center text-indigo-600">Available Courses</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <li
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 hover:shadow-indigo-300"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-indigo-600">{course.name}</h3>
              <span className="bg-indigo-100 text-indigo-600 py-1 px-4 rounded-full text-sm">Explore</span>
            </div>
            <p className="text-gray-700 mt-3">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
