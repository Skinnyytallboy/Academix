import React, { useState } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    { name: 'Math 101', description: 'Basic Math Course', professor: 'Dr. Smith' },
    { name: 'Physics 101', description: 'Basic Physics Course', professor: 'Dr. Brown' },
  ]);

  const [professors, setProfessors] = useState(['Dr. Smith', 'Dr. Brown', 'Dr. Williams']); // Mock professor list

  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    professor: '',
  });

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.description || !newCourse.professor) {
      alert('Please fill in all fields to add a course.');
      return;
    }

    setCourses([...courses, newCourse]);
    setNewCourse({ name: '', description: '', professor: '' });
  };

  const handleDeleteCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  return (
    <div className="p-6 space-y-8 bg-white min-h-screen">
      <h3 className="text-2xl font-bold text-gray-800">Course Management</h3>

      {/* Add Course Section */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Course</h4>
        <div className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          />
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newCourse.professor}
            onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })}
          >
            <option value="">Select Professor</option>
            {professors.map((professor, index) => (
              <option key={index} value={professor}>
                {professor}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddCourse}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Existing Courses Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Existing Courses</h4>
        <div className="space-y-4">
          {courses.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold text-gray-700">{course.name}</p>
                <p className="text-sm text-gray-500">{course.description}</p>
                <p className="text-sm text-gray-500">
                  <strong>Professor:</strong> {course.professor}
                </p>
              </div>
              <button
                onClick={() => handleDeleteCourse(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
