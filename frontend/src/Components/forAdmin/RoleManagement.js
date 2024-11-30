import React, { useState } from 'react';

const RoleManagement = () => {
  const [users, setUsers] = useState([
    { name: 'John Doe', role: 'Student' },
    { name: 'Jane Smith', role: 'Professor' },
    { name: 'Emily Johnson', role: 'Admin' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === 'All' || user.role === roleFilter)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h3 className="text-2xl font-bold text-gray-800">Role Management</h3>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <input
          type="text"
          className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Roles</option>
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Manage Users</h4>
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <li key={index} className="flex justify-between items-center py-4">
                <div>
                  <p className="font-semibold text-gray-700">{user.name}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Professor">Professor</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleRemoveUser(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No users match the search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
