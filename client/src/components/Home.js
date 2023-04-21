import "./Home.css"
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
            <h1 className="welcome">Welcome to Fresh Picks!</h1>
            <h2 className= "fc">Here's a list of our very own farmers! Press Sign In to get started!</h2>
            <div className="card-container">
              {farmers.map((farmer) => (
                  <div key={farmer.id} className="card">
                      <h3>{farmer.name}</h3>
                      <p>Location: {farmer.location}</p>
                      <img src={farmer.imgSrc} alt="Farm"/>
                  </div>
              ))}
            </div>
        </div>
    )
}

export default Homepage