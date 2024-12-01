import React, { useEffect, useState } from 'react';
import { fetchNotSubmittedAssignments, submitStudentAssignment } from '../../Services/api';

const SubmitAssignment = ({ user }) => {
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionDescription, setSubmissionDescription] = useState('');
    const [file, setFile] = useState(null);
    const [attachmentLink, setAttachmentLink] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const data = await fetchNotSubmittedAssignments(user.id);
                if (data && data.availableAssignments) {
                    setAssignments(data.availableAssignments);
                    if (data.availableAssignments.length > 0) {
                        setSelectedAssignment(data.availableAssignments[0].assignment_id);
                    }
                } else {
                    setMessage('Failed to fetch assignments');
                }
            } catch (error) {
                setMessage('An error occurred while fetching assignments');
            }
            setLoading(false);
        };
        fetchAssignments();
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAssignment) {
            setMessage('Please select an assignment.');
            return;
        }
        if (!file && !attachmentLink) {
            setMessage('Please provide a file or a link.');
            return;
        }
        const submissionContent = submissionDescription;
        let fileUrl = null;
        if (file) {
            fileUrl = URL.createObjectURL(file);
        } else if (attachmentLink) {
            fileUrl = attachmentLink;
        }
        const assignmentData = {
            assignmentId: selectedAssignment,
            userID: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : user.id,
            description: submissionContent,
            submissionContent,
            fileUrl,
        };
        setLoading(true);
        try {
            const response = await submitStudentAssignment(assignmentData);
            setMessage(response.message || (fileUrl ? 'Assignment with file submitted successfully!' : 'Assignment submitted successfully!'));
        } catch (error) {
            setMessage('Error submitting assignment. Please try again.');
        }
        setLoading(false);
        setSubmissionDescription('');
        setFile(null);
        setAttachmentLink('');
    };

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 p-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-indigo-600 mb-3">Submit Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 mb-2">Select Assignment</label>
                    <div className="relative">
                        <select
                            id="assignment"
                            value={selectedAssignment || ''}
                            onChange={(e) => setSelectedAssignment(Number(e.target.value))}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                        >
                            {assignments.map((assignment) => (
                                <option key={assignment.assignment_id} value={assignment.assignment_id}>
                                    {assignment.title}
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
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Submission Description</label>
                    <textarea
                        id="description"
                        value={submissionDescription}
                        onChange={(e) => setSubmissionDescription(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        placeholder="Enter submission description"
                        rows="3"
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
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                </div>
                {message && <div className="text-sm text-red-600">{message}</div>}
            </form>
        </div>
    );
};

export default SubmitAssignment;
