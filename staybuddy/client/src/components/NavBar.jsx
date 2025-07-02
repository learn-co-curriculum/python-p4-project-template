import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext.jsx";

function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🏠 StayBuddy
        </Link>

        {user && (
          <div className="navbar-welcome">Welcome, {user.username}!</div>
        )}

        <ul className="navbar-nav">
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/bookings"
                  className={`navbar-link ${isActive("/bookings") ? "active" : ""}`}
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className={`navbar-link ${isActive("/favorites") ? "active" : ""}`}
                >
                  ❤️ Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/host/new"
                  className={`navbar-link ${isActive("/host/new") ? "active" : ""}`}
                >
                  Host Your Space
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className={`navbar-link ${isActive("/login") ? "active" : ""}`}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
