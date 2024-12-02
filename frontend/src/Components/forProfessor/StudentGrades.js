import React, { useState, useEffect } from 'react';
import { fetchCoursesProf, fetchFinalGrades } from '../../Services/api';
import { ClipLoader } from 'react-spinners';

const StudentGrades = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await fetchCoursesProf();
        console.log('fetchedCourses', fetchedCourses.cour);
        setCourses(fetchedCourses.cour || []);
        if (fetchedCourses.cour?.length > 0) {
          setSelectedCourse(fetchedCourses.cour[0]);
        }
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const loadGrades = async () => {
        setLoading(true);
        setError('');
        try {
          const fetchedGrades = await fetchFinalGrades(selectedCourse.course_id);
          setGrades(fetchedGrades.grades || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      loadGrades();
    }
  }, [selectedCourse]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Student Grades</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-6">
        <label className="font-semibold text-indigo-700">Select Course:</label>
        <select
          className="ml-2 p-2 border border-indigo-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedCourse?.course_id || ''}
          onChange={(e) =>
            setSelectedCourse(courses.find((course) => course.course_id === Number(e.target.value)))
          }
        >
          {courses.map((course) => (
            <option key={course.course_id} value={course.course_id}>
              {course.course_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#4B92D0" loading={loading} size={50} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Student Name</th>
                {grades.length > 0 &&
                  grades[0]?.assignments?.map((assignment, index) => (
                    <th key={index} className="px-4 py-2 text-left">
                      {assignment.title}
                    </th>
                  ))}
                <th className="px-4 py-2 text-left">Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((student) => (
                <tr key={student.student_name} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{student.student_name}</td>
                  {student.assignments?.map((assignment, index) => (
                    <td key={index} className="px-4 py-2 text-center">
                      {assignment.score}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center font-bold text-blue-600">
                    {student.final_grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentGrades;
