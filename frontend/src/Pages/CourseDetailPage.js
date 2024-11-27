import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetailPage = () => {
  const { courseId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-medium">Course Detail for {courseId}</h2>
      {/* Display course details like assignments, grades, etc. */}
    </div>
  );
};

export default CourseDetailPage;
