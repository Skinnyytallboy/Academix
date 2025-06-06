import React, { useState } from 'react';
import Sidebar from '../Components/forStudent/Sidebar';
import Header from '../Components/forStudent/Header';
import CourseList from '../Components/forStudent/CourseList';
import Assignment from '../Components/forStudent/Assignment';
import AssignmentCalendar from '../Components/forStudent/AssignmentCalendar';
import SubmitAssignment from '../Components/forStudent/SubmitAssignment';

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('My Courses');

  const renderContent = () => {
      switch (activeTab) {
        case 'My Courses':
          return <CourseList user={user} />;
        case 'Assignments':
          return <Assignment user={user} />;
        case 'Calendar':
          return <AssignmentCalendar user={user} />;
        case 'Submit Assignment':
          return <SubmitAssignment user={user} />;
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
export default StudentDashboard;
