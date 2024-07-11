
import { Outlet ,Link} from "react-router-dom";
import './homepage.css';

function Homepage() {
    return (
        <>
        <div className="homepage-container">
            
            <hi>welcome to Event Management System</hi>
            
            
        </div>
        <div>
            <nav>
                <ul className="nav-menu">
                    <li>
                        <Link to = { `/login`}>Login</Link>
                    </li>
                    
                    <li>
                        <Link to = { `/events`}>Events</Link>
                    </li>
                    <li>
                        <Link to = { `/register`}>Register</Link>
                    </li>
                    <li>
                        <Link to = { `/createEvent`}>create Event</Link>
                    </li>
                </ul>
            </nav>
            
        </div>
        <div>
        <Outlet />
        </div>
        </>

    )
    
}
export default Homepage;
    
      