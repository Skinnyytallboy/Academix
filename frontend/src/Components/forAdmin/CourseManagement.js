import React, { useState, useEffect } from 'react';
import { fetchCourses, fetchProfessors, addCourseToDatabase, deleteCourseFromDatabase } from '../../Services/api';
import { ClipLoader } from 'react-spinners';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    professor: '',
  });

  // Fetch courses when the component mounts or when currentPage/searchQuery changes
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsLoading(true);
      const response = await fetchCourses();
      if (response.status === 'success') {
        console.log(response.dataC);
        setCourses(response.dataC);
        setTotalCourses(response.dataC.length);  // Set total courses count for pagination
      } else {
        alert('Failed to fetch courses');
      }
      setIsLoading(false);
    };
    fetchCourseData();
  }, [searchQuery]);

  useEffect(() => {
    const fetchProfessorData = async () => {
      const response = await fetchProfessors();
      if (response.status === 'success') {
        console.log(response.dataP);
        setProfessors(response.dataP);
      } else {
        alert('Failed to fetch professors');
      }
    };
    fetchProfessorData();
  }, []);

  // Handle adding a new course
  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.description || !newCourse.professor) {
      alert('Please fill in all fields to add a course.');
      return;
    }
  
    const coursePayload = {
      course_name: newCourse.name,
      description: newCourse.description,
      teacher_id: newCourse.professor,
    };
    console.log('Course Payload:', coursePayload);
    try {
      const response = await addCourseToDatabase(coursePayload);
      console.log ('Course Payload:', coursePayload);
      console.log('Response:', response);
      if (response.message === 'Course added successfully') {
        setNewCourse({ name: '', description: '', professor: '' });
        alert('Course added successfully');
      } else {
        alert('Failed to add course else condition');
      }
    } catch (error) {
      alert('Failed to add course catch error');
      console.error(error);
    }
  };
  

  // Handle deleting a course
  const handleDeleteCourse = async (courseId) => {
    const response = await deleteCourseFromDatabase(courseId);
    if (response.status === 'success') {
      setCourses(courses.filter((course) => course.course_id !== courseId));
    } else {
      alert('Failed to delete course');
    }
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle pagination
  const handlePagination = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'next' && currentPage * coursesPerPage < totalCourses) {
        return prev + 1;
      } else if (direction === 'prev' && currentPage > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2 space-y-8 bg-white min-h-screen">
      <h3 className="text-2xl font-bold text-gray-800">Course Management</h3>

      {/* Add New Course */}
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
            {professors.map((professor) => (
              <option key={professor.professor_id} value={professor.professor_id}>
                {professor.professor_name}
              </option>
            ))}
          </select>
          <button
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleAddCourse}
          >
            Add Course
          </button>
        </div>
      </div>

      {/* Search and Toggle Show All */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="w-1/3 p-2 border border-gray-300 rounded-lg"
          placeholder="Search Courses"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          onClick={() => setShowAllCourses((prev) => !prev)}
        >
          {showAllCourses ? 'Show 5 Courses' : 'Show All Courses'}
        </button>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h4 className="text-xl font-semibold text-gray-800">Courses List</h4>

        {isLoading ? (
          <div className="flex justify-center">
            <ClipLoader size={40} color="#0000ff" loading={isLoading} />
          </div>
        ) : (
          <>
            {filteredCourses.length > 0 ? (
              <table className="table-auto w-full mt-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left text-sm font-semibold">Course Name</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold">Professor</th>
                    <th className="py-2 px-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAllCourses ? filteredCourses : filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage)).map((course) => (
                    <tr key={course.course_id} className="border-b">
                      <td className="py-2 px-4 text-sm">{course.course_name}</td>
                      <td className="py-2 px-4 text-sm">{course.teacher_name}</td>
                      <td className="py-2 px-4 text-sm">
                        <button
                          className="text-red-500 hover:text-red-700 p-2 rounded-md"
                          onClick={() => handleDeleteCourse(course.course_id)}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No courses available</p>
            )}

            {/* Pagination */}
            {!showAllCourses && (
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded"
                  onClick={() => handlePagination('prev')}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="self-center text-lg">{`Page ${currentPage}`}</span>
                <button
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded"
                  onClick={() => handlePagination('next')}
                  disabled={currentPage * coursesPerPage >= totalCourses}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
