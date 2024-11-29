import React, { useState } from 'react';

const GradeSubmissions = () => {
    const data = [
        {
            courseName: 'Math 101',
            assignments: [
                {
                    assignmentTitle: 'Algebra Homework',
                    submissions: [
                        { id: 1, studentName: 'John Doe', grade: null },
                        { id: 2, studentName: 'Jane Smith', grade: 85 },
                    ],
                },
                {
                    assignmentTitle: 'Geometry Project',
                    submissions: [
                        { id: 3, studentName: 'Mike Johnson', grade: null },
                    ],
                },
            ],
        },
        {
            courseName: 'Physics 102',
            assignments: [
                {
                    assignmentTitle: 'Newton’s Laws Assignment',
                    submissions: [
                        { id: 4, studentName: 'Alice Brown', grade: 90 },
                    ],
                },
            ],
        },
    ];

    const [selectedCourse, setSelectedCourse] = useState(data[0]);
    const [selectedAssignment, setSelectedAssignment] = useState(data[0].assignments[0]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const handleGradeUpdate = (submissionId, newGrade) => {
        const updatedAssignments = selectedCourse.assignments.map((assignment) => {
            if (assignment.assignmentTitle === selectedAssignment.assignmentTitle) {
                return {
                    ...assignment,
                    submissions: assignment.submissions.map((sub) =>
                        sub.id === submissionId ? { ...sub, grade: newGrade } : sub
                    ),
                };
            }
            return assignment;
        });

        setSelectedCourse({ ...selectedCourse, assignments: updatedAssignments });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Grade Submissions</h2>

            {/* Course Dropdown */}
            <div className="mb-6">
                <label className="font-medium text-gray-600">Select Course:</label>
                <select
                    className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

            {/* Assignment Dropdown */}
            <div className="mb-8">
                <label className="font-medium text-gray-600">Select Assignment:</label>
                <select
                    className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={selectedAssignment.assignmentTitle}
                    onChange={(e) =>
                        setSelectedAssignment(
                            selectedCourse.assignments.find(
                                (assignment) => assignment.assignmentTitle === e.target.value
                            )
                        )
                    }
                >
                    {selectedCourse.assignments.map((assignment) => (
                        <option key={assignment.assignmentTitle} value={assignment.assignmentTitle}>
                            {assignment.assignmentTitle}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                    <thead className="bg-indigo-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Student Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Grade</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedAssignment.submissions.map((submission) => (
                            <tr
                                key={submission.id}
                                className="border-t border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 text-gray-800">{submission.studentName}</td>
                                <td className="px-6 py-4 text-gray-800">
                                    {submission.grade !== null ? submission.grade : 'Not Graded'}
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                                        onClick={() =>
                                            alert(
                                                `Downloading submission for ${submission.studentName}`
                                            )
                                        }
                                    >
                                        Download
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-lg shadow focus:outline-none ${
                                            submission.grade === null
                                                ? 'bg-green-600 text-white hover:bg-green-700'
                                                : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                        }`}
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        {submission.grade === null ? 'Grade' : 'Update Grade'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grade Modal */}
            {selectedSubmission && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div
                        className="bg-white p-8 rounded-lg shadow-lg w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">
                            {selectedSubmission.grade === null
                                ? `Grade Submission: ${selectedSubmission.studentName}`
                                : `Update Grade: ${selectedSubmission.studentName}`}
                        </h3>
                        <input
                            type="number"
                            placeholder="Enter Grade"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-6"
                            defaultValue={selectedSubmission.grade || ''}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 focus:outline-none"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:outline-none"
                                onClick={() => {
                                    const gradeInput = document.querySelector('input').value;
                                    if (!isNaN(gradeInput) && gradeInput.trim() !== '') {
                                        handleGradeUpdate(selectedSubmission.id, Number(gradeInput));
                                        setSelectedSubmission(null);
                                    } else {
                                        alert('Please enter a valid grade.');
                                    }
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeSubmissions;
