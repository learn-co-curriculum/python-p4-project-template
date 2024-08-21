import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './NavBar.css'

function NavBar({ currentUser, setCurrentUser }) {
  const history = useHistory();

  const handleLogout = () => {
    fetch('/logout', { method: 'DELETE' })
      .then(() => {
        setCurrentUser(null);
        history.push('/');
      });
  };

  if (!currentUser) return null;

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/credit">Credit</Link>
      <Link to="/debit">Debit</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/friendship">Friends</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default NavBar;