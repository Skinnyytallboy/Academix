import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [showAllStudents, setShowAllStudents] = useState(false);

  const userID = localStorage.getItem('userID');  // Retrieve user ID from localStorage
  const userRole = localStorage.getItem('userRole');  // Retrieve user role from localStorage

  useEffect(() => {
    // Fetch the course details from the backend
    axios
      .get(`http://localhost:5000/api/CoursePage/${courseId}`, {
        headers: {
          'userID': userID,
          'userRole': userRole
        }
      })
      .then(response => {
        setCourse(response.data);  // Assuming the API returns course data in the response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
        setLoading(false);
      });
  }, [courseId, userID, userRole]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        courseId,
        senderID: userID,
        message: newMessage
      };

      // Send the new chat message to the backend
      axios
        .post(`http://localhost:5000/api/course/${courseId}/chat`, messageData, {
          headers: {
            'userID': userID,
            'userRole': userRole
          }
        })
        .then(response => {
          setMessages([...messages, { sender: 'You', message: newMessage }]);
          setNewMessage('');
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
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
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
              <h3 className="text-2xl font-semibold text-indigo-600">Chat</h3>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className="bg-indigo-100 p-4 rounded-lg shadow-sm text-gray-700">
                    <strong>{msg.sender}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type your message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-900 transition duration-300"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
