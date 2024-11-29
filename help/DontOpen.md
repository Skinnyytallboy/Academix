


// will use this when actual data comes, api hit (REFRENCED CODE)
// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// const AssignmentCalendar = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [assignments, setAssignments] = useState([]);
//     useEffect(() => {
//         // Simulate fetching assignments for the student
//         fetch("/api/student/assignments") // Replace with your actual API endpoint
//             .then((response) => response.json())
//             .then((data) => setAssignments(data))
//             .catch((error) => console.error("Error fetching assignments:", error));
//     }, []);
//     const formatAssignmentsForDate = (date) => {
//         const formattedDate = new Date(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate()
//         ).toISOString().split('T')[0];
//         return assignments.filter((assignment) => assignment.dueDate === formattedDate);
//     };
//     const handleDateChange = (date) => {
//         setSelectedDate(date);
//     };
//     return (
//         <div className="max-w-6xl mx-auto p-6 bg-gray-50 shadow-lg rounded-2xl border border-gray-200">
//             <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
//                 Assignment Calendar
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-gradient-to-tr from-white via-gray-100 to-indigo-50 rounded-3xl p-6 shadow-xl border border-gray-200">
//                     <Calendar
//                         onChange={handleDateChange}
//                         value={selectedDate}
//                         tileContent={({ date }) => {
//                             const assignmentsForDate = formatAssignmentsForDate(date);
//                             if (assignmentsForDate.length > 0) {
//                                 return (
//                                     <span className="absolute bottom-2 right-2 bg-indigo-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-lg shadow-md">
//                                         {assignmentsForDate.length} 📌
//                                     </span>
//                                 );
//                             }
//                             return null;
//                         }}
//                         className="react-calendar-modern"
//                     />
//                 </div>
//                 <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
//                     <h3 className="text-xl font-semibold text-indigo-700 mb-4">
//                         Assignments Due on {selectedDate.toDateString()}
//                     </h3>
//                     <ul className="space-y-4">
//                         {formatAssignmentsForDate(selectedDate).map((assignment, index) => (
//                             <li
//                                 key={index}
//                                 className="p-4 bg-gray-100 border-l-4 border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-300"
//                             >
//                                 <h4 className="text-lg font-bold text-gray-800 mb-2">
//                                     {assignment.title}
//                                 </h4>
//                                 <p className="text-sm text-gray-600">
//                                     <strong>Course:</strong> {assignment.course}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                     <strong>Due Date:</strong> {assignment.dueDate}
//                                 </p>
//                             </li>
//                         ))}
//                         {formatAssignmentsForDate(selectedDate).length === 0 && (
//                             <p className="text-gray-500 text-center">
//                                 🎉 No assignments due on this date! Enjoy your day!
//                             </p>
//                         )}
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default AssignmentCalendar;
















import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CoursePage = () => {
  const { courseId } = useParams();  // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);  // Re-fetch when courseId changes

  if (loading) {
    return <div>Loading course details...</div>;
  }

  if (!course) {
    return <div>Course not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center text-indigo-600">{course.name}</h2>
      <p className="text-gray-700 mt-3">{course.description}</p>
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-indigo-600">Course Content</h3>
        <ul className="list-disc ml-8 mt-3">
          {course.content.map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      </div>
      {/* You can add more sections such as instructors, course materials, etc. */}
    </div>
  );
};

export default CoursePage;
