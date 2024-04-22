// UserProfile.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function UserProfile() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <p>Username: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default UserProfile;
