import React from "react";
import { Link } from "react-router-dom";
import "../../style.css"; // Adjust the path as needed

const HomeNav = ({ cartItemCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Online Food Menu</div>
      <ul className="navbar-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/main-page">Menu</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link> {/* Link to all orders page */}
        </li>
        <li>
          <Link to="/adminlogin">Admin</Link>
        </li>
        <li>
          <Link to="/cart" className="cart-icon">
            🛒{" "}
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default HomeNav;