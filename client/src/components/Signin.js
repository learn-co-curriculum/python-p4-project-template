import "./Home.css"
import React from 'react'
import Fbutton from "./Fbutton"
import Cbutton from "./Cbutton"
import NavBar from "./NavBar"
import "./Signin.css"

function Signin() {
  return (
    <div className="signin-container">
        <NavBar />
        <h1 className="signin-title">Are you a Farmer or a Customer?</h1>
        <div className="buttons-container">
          <Fbutton className="farm-button" />
          <Cbutton className="country-button" />
        </div>
    </div>
  )
}


export default Signin