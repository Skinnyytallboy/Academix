import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../assets/pngs/main.png';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      try {
        localStorage.removeItem('User'); // Remove the user from local storage
        setIsDropdownOpen(false); // Close the dropdown
        navigate('/'); // Redirect to the login page
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

  return (
    <div className="relative">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={mainLogo}
            alt="Logo"
            className="w-25 h-10 rounded cursor-pointer"
            onClick={() => navigate('/admin-dashboard')}
          />
          <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="relative">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <div className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              👤
            </div>
            <span className="text-sm font-medium text-gray-700">Profile</span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
              <button
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
    </div>
  );
};

export default Header;
