import React from 'react'
import {Link} from "react-router-dom"
import "./Fbutton.css"
export default function Fbutton() {
  return (
    <Link to="/farmers/login">
        <button className="farm-button">Farmers</button>
    </Link>
  )
}

