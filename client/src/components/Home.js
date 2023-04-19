import "./Home.css"
import Fbutton from "./Fbutton"
import Cbutton from "./Cbutton"
import NavBar from "./NavBar"
import React, {useState, useEffect} from "react"

function Homepage() {

    const [farmers, setFarmers] = useState([])

    
  useEffect(() => {
    fetch('http://127.0.0.1:5555/farmers')
      .then((response) => response.json())
      .then((data) => setFarmers(data));
  }, []);


    return(
        <div className="header">
            <NavBar />
            <h1 className="welcome">WELCOME!</h1>
            <h2 className= "fc">Are you a farmer or customer?</h2>
            {farmers.map((farmer) => (
                <div key={farmer.id}>
                    Name: {farmer.name}
                <p>
                    {/* --Location: {customer.address} */}
                    --Farm: <img src={farmer.imgSrc}/>
                </p>
                </div>))}
        </div>
    )
}

export default Homepage