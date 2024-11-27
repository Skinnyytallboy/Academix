import React, { useState } from 'react';
import Header from '../Components/forProfessor/ProfessorHeader';
import Sidebar from '../Components/forProfessor/Sidebar';
import CourseList from '../Components/forProfessor/CourseList';
import Gradebook from '../Components/forProfessor/Gradebook';

const ProfessorDashboard = () => {
    const [activeTab, setActiveTab] = useState('MyCourses');

    const renderContent = () => {
        switch (activeTab) {
            case 'MyCourses':
                return <CourseList />;
            case 'Gradebook':
                return <Gradebook />;
            default:
                return <CourseList />;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1">
                <Header user={{ username: 'professor123' }} />
                <div className="p-6">
                    {/* Tab Navigation */}
                    <div className="flex space-x-6 mb-6">
                        <button
                            className={`text-lg font-semibold ${activeTab === 'MyCourses' ? 'text-indigo-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('MyCourses')}
                        >
                            My Courses
                        </button>
                        <button
                            className={`text-lg font-semibold ${activeTab === 'Gradebook' ? 'text-indigo-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('Gradebook')}
                        >
                            Gradebook
                        </button>
                    </div>

                    {/* Render the Active Tab Content */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ProfessorDashboard;
