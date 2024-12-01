import React, { useState, useEffect } from 'react';
import { fetchCoursesProf, fetchAssignments, fetchSubmissions, submitGrade } from '../../Services/api';

const GradeSubmissions = () => {
    const [courses, setCourses] = useState([]); // List of courses
    const [assignments, setAssignments] = useState([]); // List of assignments for the selected course
    const [submissions, setSubmissions] = useState([]); // List of submissions for the selected assignment
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Fetch courses when the component mounts
    useEffect(() => {
        const fetchCoursesData = async () => {
            try {
                const response = await fetchCoursesProf();
                console.log('Fetched Courses:', response.cour);  // Check the response
                if (response.status === 'success') {
                    setCourses(response.cour);
                    console.log('courses', courses);
                } else {
                    setCourses([]);  // Set to empty array if data is invalid
                }
            } catch (error) {
                console.error('Error fetching courses:', error.message);
            }
        };
    
        fetchCoursesData();
    }, []);
    

    // Fetch assignments whenever a course is selected
    useEffect(() => {
        if (selectedCourse) {
            const fetchAssignmentsData = async () => {
                try {
                    const assignmentsData = await fetchAssignments(selectedCourse.course_id);
                    console.log('fetched Assignments', assignmentsData.assignments);
                    if(assignmentsData.status === 'success'){
                    setAssignments(assignmentsData.assignments);
                    setSelectedAssignment(assignmentsData.assignments[0]); 
                    }// Set the first assignment as the selected assignment by default
                    else{
                        console.error('no assignments to fetch');
                    }
                } catch (error) {
                    console.error('Error fetching assignments:', error.message);
                }
            };

            fetchAssignmentsData();
        }
    }, [selectedCourse]);

    // Fetch submissions whenever an assignment is selected
    useEffect(() => {
        if (selectedAssignment) {
            const fetchSubmissionsData = async () => {
                try {
                    const submissionsData = await fetchSubmissions(selectedAssignment.assignment_id);
                        setSubmissions(submissionsData.submissions);
                } catch (error) {
                    console.error('Error fetching submissions:', error.message);
                }
            };

            fetchSubmissionsData();
        }
    }, [selectedAssignment]);

    // Handle grade update
    const handleGradeUpdate = (submissionId, newGrade) => {
        const updatedSubmissions = submissions.map((sub) =>
            sub.id === submissionId ? { ...sub, grade: newGrade } : sub
        );
        setSubmissions(updatedSubmissions);
    };

    // Handle submitting grade to API
    const handleSubmitGrade = async (submissionId, grade) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role === 'teacher') {
                const teacherId = user.teacherId;
                const feedback = ''; // Optionally pass feedback here
    
                await submitGrade(submissionId, teacherId, grade, feedback);
                // Update state after successful submission
                handleGradeUpdate(submissionId, grade);
            }
        } catch (error) {
            console.error('Error submitting grade:', error.message);
        }
    };
    
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8">Grade Submissions</h2>

            {/* Course Dropdown */}
            <div className="mb-6">
            <label className="font-medium text-gray-600">Select Course:</label>
            <select
            className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={selectedCourse ? selectedCourse.course_name : ''}
            onChange={(e) => {
                const selected = courses.find((course) => course.course_name === e.target.value);
                setSelectedCourse(selected);
            }}
        >
            {/* Default "Select Course" option */}
            <option value="">Select Course</option>

            {/* Populate the dropdown with courses */}
            {courses.length > 0 ? (
                courses.map((course) => (
                    <option key={course.course_id} value={course.course_name}>
                        {course.course_name}
                    </option>
                ))
            ) : (
                <option value="">No courses available</option>
            )}
        </select>

        </div>

            {/* Assignment Dropdown */}
            <div className="mb-8">
                <label className="font-medium text-gray-600">Select Assignment:</label>
                <select
                    className="ml-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={selectedAssignment?.title || ''}
                    onChange={(e) => {
                        const selected = assignments.find(
                            (assignment) => assignment.title === e.target.value
                        );
                        setSelectedAssignment(selected);
                    }}
                >
                    {assignments.map((assignment) => (
                        <option key={assignment.assignment_id} value={assignment.title}>
                            {assignment.title}
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
                        {submissions.map((submission) => (
                            <tr key={submission.submission_id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800">{submission.student_name}</td>
                                <td className="px-6 py-4 text-gray-800">
                                    {submission.grade !== null ? submission.grade : 'Not Graded'}
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                                        onClick={() =>
                                            alert(`Downloading submission for ${submission.student_name}`)
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
                                ? `Grade Submission: ${selectedSubmission.student_name}`
                                : `Update Grade: ${selectedSubmission.student_name}`}
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    const grade = parseFloat(e.target.previousElementSibling.value);
                                    if (!isNaN(grade)) {
                                        handleSubmitGrade(selectedSubmission.submission_id, grade);
                                        setSelectedSubmission(null);
                                    }
                                }}
                            >
                                Submit Grade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeSubmissions;
