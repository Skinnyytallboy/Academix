import React, { useState } from 'react';

const Assignment = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('All');

    // Dummy data based on the schema
    const assignments = [
        {
            assignmentId: 1,
            course: 'Operating Systems',
            title: 'Deadlock Assignment',
            description: 'Identify and resolve deadlock issues in a simulated OS.',
            dueDate: '2024-12-05',
            assignDate: '2024-11-01',
            submissions: [
                {
                    studentId: 1,
                    status: 'Not Submitted',
                    submittedAt: null,
                    fileUrl: null,
                    plagiarismScore: 0.0,
                    grade: null,
                },
            ],
        },
        {
            assignmentId: 2,
            course: 'Data Structures',
            title: 'Binary Trees Task',
            description: 'Implement a binary tree and perform depth-first search.',
            dueDate: '2024-12-07',
            assignDate: '2024-11-10',
            submissions: [
                {
                    studentId: 1,
                    status: 'Submitted',
                    submittedAt: '2024-12-05',
                    fileUrl: 'https://example.com/assignment2.pdf',
                    plagiarismScore: 5.5,
                    grade: 'A',
                },
            ],
        },
        {
            assignmentId: 3,
            course: 'Web Development',
            title: 'Responsive Design Challenge',
            description: 'Create a responsive webpage for a given design.',
            dueDate: '2024-12-07',
            assignDate: '2024-11-20',
            submissions: [
                {
                    studentId: 1,
                    status: 'Late',
                    submittedAt: '2024-12-08',
                    fileUrl: 'https://example.com/assignment3.pdf',
                    plagiarismScore: 10.0,
                    grade: 'B+',
                },
            ],
        },
        {
            assignmentId: 4,
            course: 'Operating Systems',
            title: 'Process Synchronization Task',
            description: 'Implement process synchronization in a multi-threaded environment.',
            dueDate: '2024-12-10',
            assignDate: '2024-11-15',
            submissions: [
                {
                    studentId: 1,
                    status: 'Not Submitted',
                    submittedAt: null,
                    fileUrl: null,
                    plagiarismScore: 0.0,
                    grade: null,
                },
            ],
        },
    ];

    const courses = ['All', ...new Set(assignments.map((assignment) => assignment.course))];

    const filteredAssignments =
        activeTab === 'All'
            ? assignments
            : assignments.filter((assignment) => assignment.course === activeTab);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="mt-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4 text-center">
                Assignments by Course
            </h3>
            <div className="flex justify-center space-x-4 mb-6">
                {courses.map((course) => (
                    <button
                        key={course}
                        onClick={() => setActiveTab(course)}
                        className={`px-6 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all duration-300 ${
                            activeTab === course
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        {course}
                    </button>
                ))}
            </div>
            <div>
                {filteredAssignments.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredAssignments.map((assignment, index) => (
                            <li
                                key={index}
                                className="p-4 bg-gray-100 border-l-4 border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-300"
                            >
                                <h4 className="text-lg font-bold text-gray-800 mb-2">
                                    {assignment.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    <strong>Due Date:</strong> {assignment.dueDate}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Description:</strong> {assignment.description}
                                </p>
                                {assignment.submissions.map((submission, idx) => (
                                    <div key={idx}>
                                        <p className="text-sm text-gray-600">
                                            <strong>Status:</strong> {submission.status}
                                        </p>
                                        {submission.status === 'Submitted' && (
                                            <>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Plagiarism Score:</strong> {submission.plagiarismScore}%
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <strong>Grade:</strong> {submission.grade}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    <strong>File:</strong> 
                                                    <a href={submission.fileUrl} className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                                        View Assignment
                                                    </a>
                                                </p>
                                            </>
                                        )}
                                        {submission.status === 'Late' && (
                                            <p className="text-sm text-red-600">This assignment was submitted late.</p>
                                        )}
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center">No assignments assigned for any course!</p>
                )}
            </div>
        </div>
    );
};

export default Assignment;
