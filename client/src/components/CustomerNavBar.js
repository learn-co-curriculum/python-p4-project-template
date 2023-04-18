import React from "react";
import { NavLink } from "react-router-dom";
import './CustomerNavBar.css'


function NavBar () {

    return (
    <nav>
      <ul>
        <li className="hover-underline-animation">
        <NavLink to="/">Logout</NavLink>
        </li>
        <li className="hover-underline-animation">
        <NavLink to="/farmers">View Farmers</NavLink>
        </li>
        <li className="hover-underline-animation">
        <NavLink to="/">My Orders</NavLink>
        </li>
      </ul>
    </nav>
    )

}

export default NavBar;