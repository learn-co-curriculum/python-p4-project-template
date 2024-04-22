// Logout.js
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Logout() {
  const { logout } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = () => {
    // Call the logout function from the AuthContext
    logout();
    // Redirect to the login page
    history.push('/login');
  };

  return (
    <div>
      
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Logout;
