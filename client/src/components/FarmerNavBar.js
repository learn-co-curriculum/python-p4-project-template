import React from "react";
import { NavLink } from "react-router-dom";


function FarmerNavBar({ farmerId }) {

  // const profileUrl = `/farmers/${farmerId}`
  const linkStyles = {
    display: "inline-block",
    width: "200px",
    padding: "12px",
    margin: "0 6px 6px",
    background: "#2d1606",
    textDecoration: "none",
    color: "white",
  };

    return (
    <nav>
      <ul>
        <li className="hover-underline-animation">
        <NavLink to="/"                 
                style={linkStyles}
                activeStyle={{
                background: "maroon", 
                }}>Logout
        </NavLink>
        </li>
        {/* <li className="hover-underline-animation">
        <NavLink to="/farmers/profile">Profile</NavLink>
        </li>
        <li className="hover-underline-animation">
        <NavLink to="/farmers/orders">My Orders</NavLink>
        </li> */}
      </ul>
    </nav>
    )

}

export default FarmerNavBar;