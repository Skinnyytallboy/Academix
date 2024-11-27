import React from 'react';
import CourseList from '../components/CourseList';

const Courses = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium mb-4">My Courses</h2>
      <CourseList />
    </div>
  );
};

export default Courses;
