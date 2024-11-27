import React from 'react';
import { useParams } from 'react-router-dom';

const CoursePage = () => {
  const { courseId } = useParams();  // Get the courseId from the URL
  const courses = [
    { id: 1, name: 'Data Structures', description: 'Learn about arrays, stacks, queues, and more.' },
    { id: 2, name: 'Operating Systems', description: 'Introduction to OS concepts, including memory management.' },
    { id: 3, name: 'Database Systems', description: 'Explore the basics of database management and SQL.' },
  ];

  const course = courses.find(c => c.id === parseInt(courseId));

  if (!course) {
    return <div>Course not found!</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-4">{course.name}</h2>
      <p className="text-lg text-gray-700 mb-6">{course.description}</p>

      {/* You can add more course details here */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl">Course Content</h3>
        <ul className="mt-2 space-y-3">
          <li className="text-gray-600">Introduction to Data Structures</li>
          <li className="text-gray-600">Array Operations</li>
          <li className="text-gray-600">Stack and Queue Implementations</li>
        </ul>
      </div>
    </div>
  );
};

export default CoursePage;
