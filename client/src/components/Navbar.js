import { NavLink } from "react-router-dom"; 
import App from "./App";
 

function NavBar() { 
    
    return ( 
        <div id="navbar-container">
        <nav className="navbar">
            <NavLink to='/' >Home</NavLink> 
            <div>
            <NavLink to='/NewRecipeForm'>New Recipe Form</NavLink> 
            <NavLink to= '/login'> Login </NavLink> 
            <NavLink to = '/signup'> SignUp</NavLink>
            </div>
        </nav>
        </div>
    );
}; 

export default NavBar;