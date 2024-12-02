import React, { useState, useEffect } from "react";
import { fetchCoursesAdmin, fetchAllStudents, assignStudentsToCourse } from "../../Services/api";
import ClipLoader from "react-spinners/ClipLoader";

const AssignStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await fetchAllStudents();
      setStudents(data.students);
      setLoadingStudents(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await fetchCoursesAdmin();
      setCourses(data.courses);
      setLoadingCourses(false);
    };
    fetchCourses();
  }, []);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter((id) => id !== studentId);
      }
      return [...prevSelected, studentId];
    });
  };

  const handleAssignStudents = () => {
    if (selectedStudents.length > 0 && selectedCourse) {
      assignStudentsToCourse({ courseId: selectedCourse, studentIds: selectedStudents }).then((response) => {
        if (response.status === "success") {
          alert(response.message);
          setSelectedStudents([]);
          setSelectedCourse("");
        } else {
          alert("An error occurred. Please try again.");
        }
      });
    } else {
      alert("Please select at least one student and a course.");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-2 bg-white min-h-screen space-y-8">
      <h3 className="text-3xl font-bold text-indigo-800 text-center">
        Assign Students to Courses
      </h3>
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
        <h4 className="text-lg font-semibold text-indigo-800 mb-4">
          Assign Students
        </h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-indigo-800 font-medium">Search Students:</p>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <p className="text-indigo-800 font-medium">Select Students:</p>
            <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
              {loadingStudents ? (
                <div className="flex justify-center items-center w-full h-full">
                  <ClipLoader size={50} color={"#4c6ef5"} />
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.student_id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`student-${student.student_id}`}
                      checked={selectedStudents.includes(student.student_id)}
                      onChange={() => handleStudentSelection(student.student_id)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-indigo-300 rounded"
                    />
                    <label
                      htmlFor={`student-${student.student_id}`}
                      className="text-gray-700"
                    >
                      {student.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-indigo-800 font-medium">Select Course:</p>
            {loadingCourses ? (
              <div className="flex justify-center items-center w-full h-full">
                <ClipLoader size={50} color={"#4c6ef5"} />
              </div>
            ) : (
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            onClick={handleAssignStudents}
            className="w-full bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition duration-300 mt-4"
          >
            Assign Students to Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStudents;
