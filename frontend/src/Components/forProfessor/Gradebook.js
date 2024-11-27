import React from 'react';

const Gradebook = () => {
    const grades = [
        { studentName: 'John Doe', grade: 'A', studentId: 1 },
        { studentName: 'Jane Smith', grade: 'B+', studentId: 2 },
        { studentName: 'Alice Johnson', grade: 'A-', studentId: 3 },
    ];

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full bg-white text-sm">
                <thead>
                    <tr className="bg-indigo-600 text-white">
                        <th className="py-3 px-6 text-left">Student Name</th>
                        <th className="py-3 px-6 text-left">Grade</th>
                        <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map((grade) => (
                        <tr
                            key={grade.studentId}
                            className="border-t border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <td className="py-3 px-6">{grade.studentName}</td>
                            <td className="py-3 px-6">{grade.grade}</td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                    aria-label="Edit Grade"
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Gradebook;
