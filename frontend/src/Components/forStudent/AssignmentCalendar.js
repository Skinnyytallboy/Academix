import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { fetchAllStudentAssignments } from '../../Services/api';

const AssignmentCalendar = ({ user }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState('All');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const data = await fetchAllStudentAssignments();
                if (data.status === 'success') {
                    setAssignments(data.assignments);
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [user.id]);

    const courses = ['All', ...new Set(assignments.map((assignment) => assignment.course))];
    const formatAssignmentsForDate = (date) => {
        const formattedDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ).toISOString().split('T')[0];
        return assignments.filter((assignment) => assignment.dueDate === formattedDate);
    };
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const filteredAssignments =
        activeTab === 'All'
            ? assignments
            : assignments.filter((assignment) => assignment.course === activeTab);

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gray-50 shadow-lg rounded-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                Student Assignment Calendar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-gradient-to-tr from-white via-gray-100 to-indigo-50 rounded-3xl p-6 shadow-xl border border-gray-200">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <ClipLoader color="#4F46E5" loading={loading} size={50} />
                        </div>
                    ) : (
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileContent={({ date }) => {
                                const assignmentsForDate = formatAssignmentsForDate(date);
                                if (assignmentsForDate.length > 0) {
                                    return (
                                        <span className="absolute bottom-2 right-2 bg-indigo-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-lg shadow-md">
                                            {assignmentsForDate.length} 📌
                                        </span>
                                    );
                                }
                                return null;
                            }}
                            className="react-calendar-modern"
                        />
                    )}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                        Assignments Due on {selectedDate.toDateString()}
                    </h3>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <ClipLoader color="#4F46E5" loading={loading} size={30} />
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {formatAssignmentsForDate(selectedDate).map((assignment, index) => (
                                <li
                                    key={index}
                                    className="p-4 bg-gray-100 border-l-4 border-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all duration-300"
                                >
                                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                                        {assignment.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        <strong>Course:</strong> {assignment.course}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Teacher:</strong> {assignment.teacher}
                                    </p>
                                </li>
                            ))}
                            {formatAssignmentsForDate(selectedDate).length === 0 && (
                                <p className="text-gray-500 text-center">
                                    🎉 No assignments due on this date! Enjoy your day!
                                </p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentCalendar;
