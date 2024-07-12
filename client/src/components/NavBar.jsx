import React from 'react';
import { Link, useHistory } from 'react-router-dom'; // Import useHistory to navigate programmatically

const Navbar = () => {
  const history = useHistory(); // Get history object for programmatic navigation

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clear session, tokens, etc.)
    // Then navigate to the login page
    history.push('/'); // Redirect to login page
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/menu" className={window.location.pathname === '/menu' ? 'active' : ''}>
            Menu
          </Link>
        </li>
        <li>
          <Link to="/menu-list" className={window.location.pathname === '/menu-list' ? 'active' : ''}>
            Menu List
          </Link>
        </li>
        <li>
          <Link to="/order-list" className={window.location.pathname === '/order-list' ? 'active' : ''}>
            Order List
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;








