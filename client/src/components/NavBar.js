import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from './Logout'; // Import the Logout component


function NavBar() {
  const location = useLocation();  // Hook to get the current location
  const showLogout = location.pathname.startsWith('/timelogs');  // Determine if we're under any 'timelogs' route

  return (
    <nav>
      <h2 className="shift-pro-header">Shift Pro</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        {/* Conditionally render Logout component based on route */}
        {showLogout && (
          <li>
            <Logout />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
