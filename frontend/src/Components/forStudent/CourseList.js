import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { fetchStudentCourses } from '../../Services/api';
import { useNavigate } from 'react-router-dom';

const CourseList = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentCourses(user.id);
        if (data && data.availableCourses) {
          setCourses(data.availableCourses); // Set the availableCourses directly
        } else {
          throw new Error('No courses found');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handleCourseClick = (courseId) => {
    localStorage.removeItem('courseId');
    localStorage.setItem('courseId', courseId);
    navigate(`/course/${courseId}`);
  };

  const categorizeCourses = (statusArray) => courses.filter((course) => statusArray.includes(course.status));

  const availableCourses = categorizeCourses(['Incomplete', 'Enrolled']);
  const withdrawnCourses = categorizeCourses(['Withdrawn']);
  const completedCourses = categorizeCourses(['Completed']);
  const failedCourses = categorizeCourses(['Failed']);
  

  const renderCourseList = (courseList, clickable = false) => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courseList.map((course) => (
        <li
          key={course.id} // Assuming `id` is the correct field name here
          onClick={clickable ? () => handleCourseClick(course.course_id) : null} // Correctly passing `course.id`
          className={`bg-white p-6 rounded-lg shadow-lg transition-transform transform ${
            clickable ? 'cursor-pointer hover:scale-105 hover:shadow-indigo-300' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-indigo-600">{course.course_name}</h3>
            {clickable && <span className="bg-indigo-100 text-indigo-600 py-1 px-4 rounded-full text-sm">Explore</span>}
          </div>
          <p className="text-gray-700 mt-3">{course.description}</p>
          {course.grade && (
            <p className="mt-3 text-sm font-medium text-gray-500">Grade: {course.grade}</p>
          )}
        </li>
      ))}
    </ul>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4F46E5" loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2">
      <h2 className="text-3xl font-semibold mb-2 text-center text-indigo-600">Your Courses</h2>
      {availableCourses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Available Courses</h3>
          {renderCourseList(availableCourses, true)}
        </div>
      )}
      {withdrawnCourses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Withdrawn Courses</h3>
          {renderCourseList(withdrawnCourses)}
        </div>
      )}
      {completedCourses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-2xl font-semibold text-green-500 mb-4">Completed Courses</h3>
          {renderCourseList(completedCourses)}
        </div>
      )}
      {failedCourses.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-500 mb-4">Failed Courses</h3>
          {renderCourseList(failedCourses)}
        </div>
      )}
    </div>
  );
};

export default CourseList;
