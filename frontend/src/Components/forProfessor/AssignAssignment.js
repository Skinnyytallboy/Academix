import React, { useState, useEffect } from 'react';
import { getTeacherCourses, AssignAssignmentProfessors } from '../../Services/api';
import ClipLoader from 'react-spinners/ClipLoader';

const AssignAssignment = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState(null);
    const [attachmentLink, setAttachmentLink] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await getTeacherCourses();
                const availableCourses = response.availableCourses || [];
                setCourses(availableCourses);
                if (availableCourses.length > 0) {
                    setSelectedCourse(availableCourses[0]);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse.course_id || !assignmentTitle || !assignmentDescription || !dueDate) {
            setError('Please fill out all required fields.');
            setSuccessMessage('');
            return;
        }

        const assignmentData = {
            courseId: selectedCourse.course_id,
            assignmentTitle,
            assignmentDescription,
            dueDate,
            assignDate: new Date().toISOString(),
            link: attachmentLink || '',
            fileType: file ? file.type : '',
            filePhys: file ? file.name : ''
        };

        try {
            const result = await AssignAssignmentProfessors(assignmentData);

            if (result.status === 'success') {
                setSuccessMessage('Assignment assigned successfully!');
                setError('');
                setAssignmentTitle('');
                setAssignmentDescription('');
                setDueDate('');
                setFile(null);
                setAttachmentLink('');
            } else {
                setError('Failed to assign assignment.');
            }
        } catch (error) {
            setError(error.message || 'Failed to assign assignment');
            setSuccessMessage('');
        }
    };

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">Assign New Assignment</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="text-red-600 mb-3">{error}</div>}
                {successMessage && <div className="text-green-600 mb-3">{successMessage}</div>}
                {loading ? (
                    <div className="flex justify-center mb-4">
                        <ClipLoader size={40} color="#4B9CD3" />
                    </div>
                ) : (
                    <>
                        <div className="mb-2">
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                            <div className="relative">
                                <select
                                    id="course"
                                    value={selectedCourse.course_id || ''}
                                    onChange={(e) => {
                                        const selected = courses.find(course => course.course_id === e.target.value);
                                        setSelectedCourse(selected);
                                    }}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                                >
                                    {courses.map((course) => (
                                        <option key={course.course_id} value={course.course_id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-100">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Assignment Title</label>
                            <input
                                type="text"
                                id="title"
                                value={assignmentTitle}
                                onChange={(e) => setAssignmentTitle(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                placeholder="Enter assignment title"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Assignment Description</label>
                            <textarea
                                id="description"
                                value={assignmentDescription}
                                onChange={(e) => setAssignmentDescription(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                placeholder="Enter assignment description"
                                rows="3"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="attachment" className="block text-sm font-semibold text-gray-700 mb-3">Upload File or Provide Link</label>
                            <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label
                                        htmlFor="attachment"
                                        className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md cursor-pointer hover:bg-indigo-700 transition ease-in-out"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            className="mr-2 text-white"
                                        >
                                            <path d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Choose File</span>
                                        <input
                                            type="file"
                                            id="attachment"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {file && (
                                        <span className="text-sm text-gray-600">{file.name}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        id="attachmentLink"
                                        value={attachmentLink}
                                        onChange={(e) => setAttachmentLink(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ease-in-out"
                                        placeholder="Or paste attachment link"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
                            >
                                Assign Assignment
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default AssignAssignment;
