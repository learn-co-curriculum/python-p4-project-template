import React from 'react'
import {Link} from "react-router-dom"
import "./Cbutton.css"
export default function Cbutton() {
  return (
    <Link to='/customers'>
        <button className="country-button">Customers</button>
    </Link>
  )
}

