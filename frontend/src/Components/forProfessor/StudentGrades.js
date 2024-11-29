import React, { useState } from 'react';

const StudentGrades = () => {
    const data = [
        {
            courseName: 'Math 101',
            students: [
                {
                    name: 'John Doe',
                    assignments: [
                        { title: 'Algebra Homework', grade: 85 },
                        { title: 'Geometry Project', grade: 90 },
                    ],
                },
                {
                    name: 'Jane Smith',
                    assignments: [
                        { title: 'Algebra Homework', grade: 88 },
                        { title: 'Geometry Project', grade: 92 },
                    ],
                },
            ],
        },
        {
            courseName: 'Physics 102',
            students: [
                {
                    name: 'Alice Brown',
                    assignments: [
                        { title: 'Newton’s Laws Assignment', grade: 90 },
                        { title: 'Optics Lab', grade: 94 },
                    ],
                },
                {
                    name: 'Bob Green',
                    assignments: [
                        { title: 'Newton’s Laws Assignment', grade: 85 },
                        { title: 'Optics Lab', grade: 87 },
                    ],
                },
            ],
        },
    ];

    const [selectedCourse, setSelectedCourse] = useState(data[0]);

    const calculateFinalGrade = (assignments) => {
        const totalGrade = assignments.reduce((sum, assignment) => sum + assignment.grade, 0);
        return (totalGrade / assignments.length).toFixed(2); // Return the average grade
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Grades</h2>

            {/* Course Dropdown */}
            <div className="mb-6">
                <label className="font-semibold text-gray-700">Select Course:</label>
                <select
                    className="ml-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCourse.courseName}
                    onChange={(e) =>
                        setSelectedCourse(data.find((course) => course.courseName === e.target.value))
                    }
                >
                    {data.map((course) => (
                        <option key={course.courseName} value={course.courseName}>
                            {course.courseName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Students and Assignments Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Student Name</th>
                            {selectedCourse.students[0]?.assignments.map((assignment) => (
                                <th key={assignment.title} className="px-4 py-2 text-left">
                                    {assignment.title}
                                </th>
                            ))}
                            <th className="px-4 py-2 text-left">Final Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedCourse.students.map((student) => (
                            <tr key={student.name} className="hover:bg-gray-100">
                                <td className="px-4 py-2">{student.name}</td>
                                {student.assignments.map((assignment, index) => (
                                    <td key={index} className="px-4 py-2 text-center">
                                        {assignment.grade}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-center font-bold text-blue-600">
                                    {calculateFinalGrade(student.assignments)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentGrades;
