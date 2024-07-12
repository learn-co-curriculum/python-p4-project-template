import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom'; 
import { UserContext } from '../context/UserContext';
import './NavBar.css';

function NavBar() {
    const { user, logout } = useContext(UserContext);

    return (
        <nav className="navbar">
            {user ? (
                <>
                    <NavLink to="/" className="nav-link">Home</NavLink>
                    <NavLink to="/book-club" className="nav-link">Book~Nook</NavLink>
                    <NavLink to="/profile" className="nav-link">Profile</NavLink>
                    <NavLink to="/about" className="nav-link">About</NavLink> 
                    <button onClick={logout} className="nav-link">Log Out</button>
                </>
            ) : (
                <>
                    <NavLink to="/login" className="nav-link">Log In</NavLink>
                    <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
                </>
            )}
        </nav>
    );
}

export default NavBar;
