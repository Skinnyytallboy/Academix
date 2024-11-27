import React from 'react';
import Grades from '../components/Grades';

const GradesPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium mb-4">My Grades</h2>
      <Grades />
    </div>
  );
};

export default GradesPage;
