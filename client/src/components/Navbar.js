import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/main">Home</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;