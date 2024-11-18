import React from 'react';

const Requests = () => {
  const requests = [
    { id: 1, institute: 'XYZ School', status: 'Pending' },
    { id: 2, institute: 'ABC Academy', status: 'Approved' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Requests</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Institute</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border px-4 py-2">{req.institute}</td>
              <td className="border px-4 py-2">{req.status}</td>
              <td className="border px-4 py-2">
                {req.status === 'Pending' && (
                  <>
                    <button className="text-green-500">Approve</button>
                    <button className="text-red-500 ml-2">Deny</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Requests;
