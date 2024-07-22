import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate to navigate programmatically

const Navbar = () => {
  const navigate = useNavigate(); // Get navigate function for programmatic navigation

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clear session, tokens, etc.)
    // Then navigate to the login page
    navigate("/"); // Redirect to login page
  };

  return (
    <nav>
      <ul>
        <li>
          <Link
            to="/menu-table"
            className={window.location.pathname === "/menu-table" ? "active" : ""}
          >
            Menu
          </Link>
        </li>
        <li>
          <Link
            to="/menu-list"
            className={
              window.location.pathname === "/menu-list" ? "active" : ""
            }
          >
            Menu List
          </Link>
        </li>
        {/* Remove the Order List link */}
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
