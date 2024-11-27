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
    navigate(`/course/${courseId}`);  // Navigate to the individual course page
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Courses</h2>
      <ul className="space-y-6">
        {courses.map(course => (
          <li
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
          >
            <h3 className="font-semibold text-xl text-indigo-600">{course.name}</h3>
            <p className="text-gray-700 mt-2">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
