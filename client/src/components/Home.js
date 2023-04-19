import "./Home.css"
import Fbutton from "./Fbutton"
import Cbutton from "./Cbutton"
import NavBar from "./NavBar"
function Homepage() {
    return(
        <div className="header">
            <h1 className="welcome">WELCOME!</h1>
            <h2 className= "fc">Are you a farmer or customer?</h2>
            <br/>
            <br/>
            <br/>
            <NavBar />
            <Fbutton/>
            <Cbutton/>
        </div>
    )
}

export default Homepage