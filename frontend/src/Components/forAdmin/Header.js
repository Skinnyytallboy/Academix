import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '../../assets/pngs/main.png';

const Header = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
  
    const formatName = (username) => {
      const nameWithoutNumbers = username.replace(/\d+$/, '');
      return nameWithoutNumbers.charAt(0).toUpperCase() + nameWithoutNumbers.slice(1);
    };

    const handleLogout = () => {
      try {
        localStorage.removeItem('user');
        window.location.href = '/';
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
          <h1 className="text-lg font-semibold text-gray-800">Welcome to {user ? `${formatName(user.username)}'s Dashboard` : 'Admin Dashboard'}</h1>
        </div>

        <div className="relative">
          <div
            className="flex items-center space-x-1 cursor-pointer hover:text-indigo-600"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <div className="text-white w-10 h-10 flex items-center justify-center rounded-full">
              👤
            </div>
            <span className="text-sm font-medium text-gray-700">Profile</span>
          </div>

          {isDropdownOpen && (
              <div className="absolute dropdown-menu right-0 mt-2 w-75 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => navigate('/Profile')}
                  className="block w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium text-sm transition duration-150 ease-in-out"
                >
                  Profile
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-3 text-red-500 hover:bg-red-100 hover:text-red-700 font-medium text-sm transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
        )}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-indigo-900 to-indigo-700"></div>
    </div>
  );
};

export default Header;
