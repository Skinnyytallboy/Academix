import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(user);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log('Updated user info:', userInfo);
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-gray-50 border border-gray-300 rounded-xl shadow-md">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 font-bold text-4xl flex items-center justify-center rounded-full">
                    {userInfo.username.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">
                    {isEditing ? (
                        <input
                            type="text"
                            name="username"
                            value={userInfo.username}
                            onChange={handleChange}
                            className="w-full text-center bg-gray-50 border-b-2 border-gray-400 focus:border-indigo-500 outline-none"
                        />
                    ) : (
                        userInfo.username
                    )}
                </h1>
                <p className="text-gray-600 text-lg">{userInfo.role}</p>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600 font-medium">Email:</span>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            className="text-gray-800 border-b border-gray-300 focus:border-indigo-500 outline-none"
                        />
                    ) : (
                        <span className="text-gray-800">{userInfo.email}</span>
                    )}
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600 font-medium">User ID:</span>
                    <span className="text-gray-800">{userInfo.userId}</span>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={handleBack}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:ring focus:ring-gray-400"
                >
                    Back
                </button>
                <div className="flex space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring focus:ring-red-400"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring focus:ring-indigo-400"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
