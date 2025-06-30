import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/stays">Stays</Link>
      {user ? (
        <>
          <Link to="/bookings">My Bookings</Link>
          <Link to="/host/listings">My Listings</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;