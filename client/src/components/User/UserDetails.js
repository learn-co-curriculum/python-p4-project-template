import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserDetails.css'; 

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://api.example.com/users/${id}`); 
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-details-container">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Joined: {user.joinedDate}</p>
      
    </div>
  );
};

export default UserDetails;
