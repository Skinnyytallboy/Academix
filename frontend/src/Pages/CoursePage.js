import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoursePage = ({ user }) => {
  const { courseId } = useParams();
  const navigate = useNavigate(); 

  const [showAllStudents, setShowAllStudents] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('announcements');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyCourses = [
      {
        id: 1,
        name: 'Data Structures',
        description: 'Learn about arrays, stacks, queues, and more.',
        content: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Graphs'],
        announcements: ['Course starts next Monday!', 'First assignment due in 2 weeks.'],
        students: ['Alice', 'Bob', 'Charlie'],
        teachers: ['Prof. Smith', 'Dr. Johnson'],
      },
      {
        id: 2,
        name: 'Operating Systems',
        description: 'Introduction to OS concepts, including memory management.',
        content: ['Processes', 'Memory Management', 'File Systems', 'Concurrency', 'Scheduling'],
        announcements: ['Midterm exam next week.', 'Homework 3 posted.'],
        students: ['David', 'Ella', 'Frank'],
        teachers: ['Prof. Williams', 'Dr. Brown'],
      },
      {
        id: 3,
        name: 'Database Systems',
        description: 'Explore the basics of database management and SQL.',
        content: ['SQL Basics', 'Normalization', 'Database Design', 'Indexing', 'Transactions'],
        announcements: ['Assignment 1 is available.', 'Final project info coming soon.'],
        students: ['Grace', 'Hannah', 'Ivy'],
        teachers: ['Prof. Lee', 'Dr. Davis'],
      }
    ];
    const selectedCourse = dummyCourses.find(course => course.id === parseInt(courseId));
    if (selectedCourse) {
      setCourse(selectedCourse);
    }
    setLoading(false);
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading course details...</div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Course not found.</div>
      </div>
    );
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'You', message: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7x1 mx-auto p-8 relative">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-5" 
        style={{ backgroundImage: 'url(https://as2.ftcdn.net/v2/jpg/05/01/00/41/1000_F_501004159_TPThHESmaprO9DH1ILvmH66eg8X0OdIF.jpg)' }}
      ></div>
      <div className="relative z-10">
      <div className="mb-4">
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 text-lg font-semibold bg-green-600 hover:bg-green-900 text-white rounded-lg shadow-md transition duration-300"
        >
          &#8592; Back to Home
        </button>
      </div>
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 rounded-lg shadow-xl mb-8 transform hover:scale-104 transition-transform duration-300">
          <h2 className="text-4xl font-bold tracking-tight">{course.name}</h2>
          <p className="text-lg mt-2 opacity-80">{course.description}</p>
        </div>
        <div className="flex justify-center mb-10">
          {['announcements', 'People', 'content', 'chat'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-14 py-2 text-xl font-semibold transition-all duration-300 rounded-lg 
                ${activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg border-b-4 border-indigo-600 transform scale-105' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'} 
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="space-y-6">
          {activeTab === 'announcements' && (
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Announcements</h3>
              <ul className="space-y-3">
                {course.announcements.map((announcement, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm text-gray-700">
                    {announcement}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'People' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Students & Teachers</h3>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Teachers</h4>
                  <div className="space-y-2">
                    {course.teachers.map((teacher, index) => (
                      <div key={index} className="bg-indigo-50 p-3 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
                        <p className="text-gray-600">{teacher}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <h4 className="text-xl font-semibold text-gray-700 mb-4">Students</h4>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {course.students.slice(0, 10).map((student, index) => (
                      <div key={index} className="bg-indigo-50 p-3 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
                        <p className="text-gray-600">{student}</p>
                      </div>
                    ))}
                    {course.students.length > 10 && (
                      <button
                        className="w-full text-indigo-600 mt-4 p-2 rounded-md hover:bg-indigo-100 transition-colors"
                        onClick={() => setShowAllStudents(!showAllStudents)}
                      >
                        {showAllStudents ? 'Show Less' : 'Show All'}
                      </button>
                    )}
                    {showAllStudents &&
                      course.students.slice(10).map((student, index) => (
                        <div key={index} className="bg-indigo-50 p-3 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
                          <p className="text-gray-600">{student}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'content' && (
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Course Content</h3>
              <ul className="space-y-2 text-gray-700">
                {course.content.map((item, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-lg shadow-sm">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'chat' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Chat</h3>
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm text-gray-600">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="font-semibold">{message.sender}</div>
                      <div>{message.message}</div>
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Type your message here"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-3 px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
