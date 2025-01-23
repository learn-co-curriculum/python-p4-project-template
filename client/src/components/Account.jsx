import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Account() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    fetch('/api/account', {
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch account details');
        }
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    fetch('/api/account', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update account details');
        }
        return response.json();
      })
      .then(() => {
        setSuccess('Account details updated successfully!');
        setIsEditing(false);
      })
      .catch((err) => setError(err.message));
  };

  const handleReturnToDashboard = () => {
    navigate('/'); 
  };

  return (
    <div>
      <h1>My Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Password:</strong> ********</p>
          <button onClick={() => setIsEditing(true)}>Edit Account</button>
          <button onClick={handleReturnToDashboard}>Return to Dashboard</button>
        </div>
      )}
    </div>
  );
}

export default Account;