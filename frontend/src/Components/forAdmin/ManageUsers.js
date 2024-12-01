import React, { useState, useEffect } from 'react';
import { fetchUsers, addUser , deleteUser  } from '../../Services/api';
import { ClipLoader } from 'react-spinners';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser , setNewUser ] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    studentAttributes: {
      name: '',
      dob: '',
      rollNo: '',
      semester: '',
      academicYear: '',
      currentStatus: 'Active',
    },
    teacherAttributes: {
      name: '',
    },
    adminAttributes: {
      name: '',
      role: '',
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsersData = async () => {
      setIsLoading(true);
      const response = await fetchUsers();
      if (response.status === "success") {
        setUsers(response.users);
        setTotalUsers(response.users.length); // Assuming response.users is an array
      } else {
        alert('Failed to fetch users');
      }
      setIsLoading(false);
    };
    fetchUsersData();
  }, []);

  const handleDeleteUser  = async (index) => {
    const userId = users[index].user_id;  // Assuming each user has a user_id
    try {
      const result = await deleteUser (userId); // Use deleteUser  function
      if (result) {
        const updatedUsers = [...users];
        updatedUsers.splice(index, 1);
        setUsers(updatedUsers);
      }
    } catch (error) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleAddUser  = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.password ||
      !newUser.role
    ) {
      alert('All fields are required!');
      return;
    }

    try {
      const result = await addUser (newUser); // Use addUser  function
      if (result) {
        // Refresh the user list after adding a new user
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        setIsModalOpen(false);
        setNewUser ({
          username: '',
          email: '',
          password: '',
          role: 'student',
          studentAttributes: {
            name: '',
            dob: '',
            rollNo: '',
            semester: '',
            academicYear: '',
            currentStatus: 'Active',
          },
          teacherAttributes: {
            name: '',
          },
          adminAttributes: {
            name: '',
            role: '',
          }
        });
      }
    } catch (error) {
      alert(error.message || 'An error occurred while adding the user');
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedUsers = users.slice(0, currentPage * usersPerPage);

  return (
    <div className="p-2 bg-white min-h-screen space-y-4">
      <h3 className="text-3xl font-bold text-indigo-800">Manage Users</h3>
      {isLoading && (
        <div className="flex justify-center items-center my-6">
          <ClipLoader color="#3b82f6" loading={isLoading} size={50} />
        </div>
      )}
      {!isLoading && (<div className="bg-white drop-shadow-2xl rounded-lg shadow-lg p-6 mt-6">
        <h4 className="text-xl font-semibold text-indigo-800 mb-4">Users</h4>
        {displayedUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {displayedUsers.map((user, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-4 hover:bg-indigo-50 rounded-lg transition"
              >
                <div>
                  <p className="font-semibold ml-4 text-indigo-700">{user.username}</p>
                  <p className="text-sm ml-4 text-gray-500 ">{user.email}</p>
                  <p className="text-sm ml-4 text-gray-500">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser (index)}
                  className="bg-red-500 text-white px-4 py-2 mr-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No users found.</p>
        )}
      </div>
      )}
      {displayedUsers.length < totalUsers && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Load More
          </button>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Add User
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md transition-all transform scale-105">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">Add New User</h4>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser ({ ...newUser , username: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser ({ ...newUser , email: e.target.value })
                }
              />
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser ({ ...newUser , password: e.target.value })
                }
              />
              <select
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser ({ ...newUser , role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              {newUser.role === 'student' && (
                <>
                  <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Name"
                  value={newUser.studentAttributes.name}
                  onChange={(e) =>
                    setNewUser ({
                      ...newUser ,
                      studentAttributes: { ...newUser.studentAttributes, name: e.target.value },
                    })
                  }
                />
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={newUser.studentAttributes.dob}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        studentAttributes: {
                          ...newUser.studentAttributes,
                          dob: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Roll No"
                    value={newUser.studentAttributes.rollNo}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        studentAttributes: {
                          ...newUser.studentAttributes,
                          rollNo: e.target.value,
                        },
                      })
                    }
                  />
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Semester"
                    value={newUser.studentAttributes.semester}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        studentAttributes: {
                          ...newUser.studentAttributes,
                          semester: e.target.value,
                        },
                      })
                    }
                  />
                  <input type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={newUser.studentAttributes.academicYear}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        studentAttributes: {
                          ...newUser.studentAttributes,
                          academicYear: e.target.value,
                        },
                      })
                    }
                  />
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={newUser.studentAttributes.currentStatus}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        studentAttributes: {
                          ...newUser.studentAttributes,
                          currentStatus: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="Graduated">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Inactive</option>
                  </select>
                </>
              )}
              {newUser.role === 'teacher' && (
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Name"
                  value={newUser.teacherAttributes.name}
                  onChange={(e) =>
                    setNewUser ({
                      ...newUser ,
                      teacherAttributes: { ...newUser.teacherAttributes, name: e.target.value },
                    })
                  }
                />
              )}
              {newUser.role === 'admin' && (
                <>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Admin Name"
                    value={newUser.adminAttributes.name}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        adminAttributes: { ...newUser.adminAttributes, name: e.target.value },
                      })
                    }
                  />
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={newUser.adminAttributes.role}
                    onChange={(e) =>
                      setNewUser ({
                        ...newUser ,
                        adminAttributes: { ...newUser.adminAttributes, role: e.target.value },
                      })
                    }
                  >
                    <option value="super">Super Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser }
                  className="bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-800 transition duration-300"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;