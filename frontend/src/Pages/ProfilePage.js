import React from 'react';
import Profile from '../Components/Profile';

const ProfilePage = ({ user }) => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">My Profile</h2>
            <Profile user={user} />
        </div>
    );
};

export default ProfilePage;
