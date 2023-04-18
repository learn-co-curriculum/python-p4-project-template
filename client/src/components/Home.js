import "./Home.css"
import Fbutton from "./Fbutton"
function Homepage() {
    return(
        
        <div className="header">
            <h1 className="welcome">WELCOME!</h1>
            <h2 className= "fc">Are you a farmer or customer?</h2>
            <br/>
            <br/>
            <br/>
            <Fbutton/>
        </div>
    )
}

export default Homepage