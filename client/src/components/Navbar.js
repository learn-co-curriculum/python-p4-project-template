import React from 'react';
import { NavLink } from 'react-router-dom';
import '../stylesheets/navbar.css';

const Navbar = () => {
  return (
    <div className='header'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1" >Restaurant Finder
          <img className='logo' src='../restaurant.png' alt='restaurant logo...'/>
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="d-flex px-3">
          <div className="navbar-nav">
            <NavLink className='nav-link' to='/'>Home</NavLink>
            <NavLink className='nav-link' to='/restaurants'>Restaurants</NavLink>
            <NavLink className='nav-link' to='/restaurants/new'>Create</NavLink>
          </div>
        </div>
      </div>
</nav>
    </div>
  )
}

export default Navbar