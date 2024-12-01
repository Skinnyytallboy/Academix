import React, { useState, useEffect } from 'react';
import { fetchAssignmentDetails } from '../../Services/api';
import { ClipLoader } from 'react-spinners';

const Assignment = ({ user }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('All');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const data = await fetchAssignmentDetails();
                setAssignments(data.assignments);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [user.id]);

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
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ClipLoader color="#4c6ef5" size={50} />
                    </div>
                ) : filteredAssignments.length > 0 ? (
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
                                {assignment.submissions.length === 0 ? (
                                    <p className="text-sm text-gray-600">No submissions yet.</p>
                                ) : (
                                    assignment.submissions.map((submission, idx) => (
                                        <div key={idx}>
                                            <p className="text-sm text-gray-600">
                                                <strong>Status:</strong> 
                                                {submission.status === 'Submitted'
                                                    ? 'Submitted'
                                                    : 'Not Submitted'}
                                            </p>
                                            {submission.status === 'Submitted' && (
                                                <>
                                                    {submission.plagiarismScore !== undefined && (
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Plagiarism Score:</strong> {submission.plagiarismScore}%
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600">
                                                        <strong>Grade:</strong> {submission.grade || 'Not Graded'}
                                                    </p>
                                                    {submission.fileUrl && (
                                                        <p className="text-sm text-gray-600">
                                                            <strong>File:</strong>
                                                            <a href={submission.fileUrl} className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                                                View Assignment
                                                            </a>
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                            {submission.status === 'Late' && (
                                                <p className="text-sm text-red-600">This assignment was submitted late.</p>
                                            )}
                                        </div>
                                    ))
                                )}
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
