import React, { useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Professor John', role: 'Professor' },
    { id: 2, name: 'Student Alice', role: 'Student' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                <button className="text-blue-500">Edit</button>
                <button className="text-red-500 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
