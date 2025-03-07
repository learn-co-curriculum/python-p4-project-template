import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../stylesheets/restaurant.css"

const Restaurant= ({ restaurant, onUpdateList }) => {

  const navigate = useNavigate()
  const { id, name, image, location, isFavorite } = restaurant  
  
  function handleFavoriteClick() {    
    fetch(`http://localhost:6001/restaurants/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "Application/JSON"
      },
      body: JSON.stringify({isFavorite: !isFavorite})
    }).then(res => res.json())
    .then(data => {
      onUpdateList(data)
    })
  }

  function handleButtonClick() {
    navigate(`/restaurants/${id}`)
  }

  return (
    <div className='card position-relative'>
      <img src={image} alt={name} />
      <div className="container">
        <h5>{name}</h5>
        <p>Location: {location}</p> 
        <div className="btn-toolbar justify-content-between" role="toolbar">
          <div className="btn-group" role="group" aria-label="button">
            <button className='btn btn-light' onClick={handleButtonClick}>More info...</button>
          </div>
          <div className="favorite-group">
            <div className="favorite-group-icon">
              {isFavorite? 
                ( <i className="bi bi-heart-fill" onClick={handleFavoriteClick}></i>) : 
                ( <i className="bi bi-heart" onClick={handleFavoriteClick}></i>)
              }
            </div>               
          </div>
        </div>           
      </div>
    </div>
  )
}

export default Restaurant