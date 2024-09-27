import React from "react";
import { NavLink } from "react-router-dom";

function NavBar({currUser}) {
    if(currUser!==""){
    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Signout</NavLink>
            <NavLink to="/pets">Pets</NavLink>
            <NavLink to="/profile">Profile</NavLink>
        </div>
    )
    }else{
        return(
        <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login/Signup</NavLink>
            <NavLink to="/pets">Pets</NavLink>
        </div>
        )
    }
}

export default NavBar;