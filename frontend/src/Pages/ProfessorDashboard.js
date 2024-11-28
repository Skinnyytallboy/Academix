import React, { useState } from 'react';
import Header from '../Components/forProfessor/ProfessorHeader';
import Sidebar from '../Components/forProfessor/Sidebar';
import CourseList from '../Components/forProfessor/CourseList';
import AssignAssignment from '../Components/forProfessor/AssignAssignment';
import AssignmentCalendar from '../Components/forProfessor/AssignmentCalendar';

const ProfessorDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('My Courses');

    const renderContent = () => {
        switch (activeTab) {
          case 'My Courses':
            return <CourseList />;
          case 'Assignments':
            return <AssignAssignment />;
          case 'Calender':
            return <AssignmentCalendar />;
          default:
            return <CourseList />;
        }
      };

    return (
        <div className="flex h-screen">
         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
         <div className="flex-1 ">
           <Header user={user} />
           <div className="p-4">{renderContent()}</div>
         </div>
        </div>
    );
};

export default ProfessorDashboard;
