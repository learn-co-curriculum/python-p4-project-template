import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';


function Navbar() {
  return (
    <nav className='navbar-container'>
      <ul className='navbar-links'>
        <li className='navbar-link'><Link to="/">Home</Link></li>
        <li className='navbar-link'><Link to="/properties">Properties</Link></li>
        <li className='navbar-link'><Link to="/add-property">Add Property</Link></li>
        <li className='navbar-link'><Link to="/register">Register</Link></li>
        <li className='navbar-link'><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;