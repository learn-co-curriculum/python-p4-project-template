import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

function NavBar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Use username instead of email

    const handleLogout = () => {
        localStorage.removeItem('username');  // Clear username from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="navbar">
            <h1>Budget Buddy</h1>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className="nav-link">Home</NavLink>
                </li>
                {username ? (
                    <>
                        <li>
                            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/login" className="nav-link">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/register" className="nav-link">Register</NavLink>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;