import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';  // Import ClipLoader

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('announcements');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [newContent, setNewContent] = useState('');  // For new content by teachers

  const user = JSON.parse(localStorage.getItem('user'));
  const userID = user ? user.userId : null;
  const userRole = user ? user.role : null;
  const courseID = localStorage.getItem('courseId');

  useEffect(() => {
    // Fetch the course details from the backend
    axios
      .get(`http://localhost:5000/api/CoursePage/${courseID}`, {
        headers: {
          'userID': userID,
          'userRole': userRole
        }
      })
      .then(response => {
        const courseData = response.data;
        setCourse(courseData.courseContent); // Store course content
        setMessages(courseData.chatMessages); // Store chat messages
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
        setLoading(false);
      });
  }, [courseID, userID, userRole]);

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

  const handleSendAnnouncement = () => {
    if (newAnnouncement.trim() !== '') {
      const announcementData = {
        courseId,
        senderID: userID,
        announcement: newAnnouncement
      };

      // Send the new announcement to the backend
      axios
        .post(`http://localhost:5000/api/course/${courseId}/announcement`, announcementData, {
          headers: {
            'userID': userID,
            'userRole': userRole
          }
        })
        .then(response => {
          // Update the course's announcements
          setCourse({
            ...course,
            announcements: [...course.announcements, newAnnouncement]
          });
          setNewAnnouncement('');
        })
        .catch(error => {
          console.error('Error sending announcement:', error);
        });
    }
  };

  const handleAddContent = () => {
    if (newContent.trim() !== '') {
      const contentData = {
        courseId,
        senderID: userID,
        content: newContent
      };

      axios
        .post(`http://localhost:5000/api/course/${courseId}/content`, contentData, {
          headers: {
            'userID': userID,
            'userRole': userRole
          }
        })
        .then(response => {
          setCourse({
            ...course,
            content: [...course.content, newContent]
          });
          setNewContent('');
        })
        .catch(error => {
          console.error('Error sending content:', error);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4B92D7" size={50} loading={loading} />
        <div className="ml-4 text-xl text-gray-600">Loading course details...</div>
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
              {userRole === 'teacher' && (
                <div className="mb-4">
                  <textarea
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    className="w-full px-4 py-2 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write a new announcement..."
                  />
                  <button
                    onClick={handleSendAnnouncement}
                    className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-900"
                  >
                    Send Announcement
                  </button>
                </div>
              )}
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
                  <div className="space-y-2">
                    {course.students.map((student, index) => (
                      <div key={index} className="bg-indigo-50 p-3 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer">
                        <p className="text-gray-600">{student}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'content' && userRole === 'teacher' && (
            <div className="space-y-4">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full h-40 p-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add course content..."
              />
              <button
                onClick={handleAddContent}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-900"
              >
                Add Content
              </button>
            </div>
          )}
          {activeTab === 'chat' && (
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Chat</h3>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
                    <p className="text-lg font-semibold">{message.sender}</p>
                    <p className="text-gray-600">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full h-16 p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-900"
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
