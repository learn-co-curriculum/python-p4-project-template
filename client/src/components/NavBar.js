import { NavLink } from "react-router-dom";
import "./NavBar.css"

function NavBar() {
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
        <div className="navbar">
            <NavLink
                to="/Home"
                exact
                style={linkStyles}
                activeStyle={{
                background: "maroon", 
                }}
            >
                Home
            </NavLink>
            <NavLink
                to="/farmers"
                exact
                style={linkStyles}
                activeStyle={{
                background: "maroon",
                }}
            >
                Farms
            </NavLink>
        </div>
  );
}

export default NavBar