import React, { useState, useEffect } from 'react';
import { getTeacherCourses } from '../../Services/api';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await getTeacherCourses();
        setCourses(response.availableCourses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    localStorage.removeItem('courseId');
    localStorage.setItem('courseId', courseId);
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-8 text-center text-indigo-600">Available Courses</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <ClipLoader color="#4F46E5" size={50} />
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <li
              key={course.course_id}
              onClick={() => handleCourseClick(course.course_id)}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 hover:shadow-indigo-300"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-indigo-600">{course.course_name}</h3>
                <span className="bg-indigo-100 text-indigo-600 py-1 px-4 rounded-full text-sm">Explore</span>
              </div>
              <p className="text-gray-700 mt-3">{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;
