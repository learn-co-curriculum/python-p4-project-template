import { NavLink } from "react-router-dom";
import "./NavBar.css"

function NavBar() {
    return (
        <div className="navbar">
            <NavLink
                to="/Home"
                exact
            >
                Home
            </NavLink>
            <NavLink
                to="/signin"
                exact
            >
                Sign In
            </NavLink>
        </div>
  );
}

export default NavBar