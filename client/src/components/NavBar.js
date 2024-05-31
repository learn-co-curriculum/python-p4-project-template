import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home Page</Link></li>
                <li><Link to="/players">Player List</Link></li>
                <li><Link to="/create-fantasy-team">Create Fantasy Team</Link></li>
                <li><Link to="/games/new">Log Previous Games</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;
