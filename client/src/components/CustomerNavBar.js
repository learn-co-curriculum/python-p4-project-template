import React from "react";
import { NavLink } from "react-router-dom";
import './CustomerNavBar.css'


function CustomerNavBar() {

    return (
    <nav>
      <ul>
        <li className="hover-underline-animation">
        <NavLink to="/">Logout</NavLink>
        </li>
        <li className="hover-underline-animation">
        <NavLink to="/customer/farmers">View Farmers</NavLink>
        </li>
        <li className="hover-underline-animation">
        <NavLink to="/">My Orders</NavLink>
        </li>
      </ul>
    </nav>
    )

}

export default CustomerNavBar;