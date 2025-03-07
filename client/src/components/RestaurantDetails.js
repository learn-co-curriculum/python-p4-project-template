import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../stylesheets/details.css";

const RestaurantDetails = () => {

  const params = useParams();
  const restaurantId = params.id;
  const [restaurant, setRestaurant] = useState({})
  const { name, image, location, isFavorite, phoneNumber, rating } = restaurant 

  useEffect(() => {
    fetch(`http://localhost:6001/restaurants/${restaurantId}`)
    .then(res => res.json())
    .then(data => setRestaurant(data))
  }, [restaurantId])
  
  return (
    <div className='details container'>
      <h1>{name}</h1>
      <hr className='border-line'/>
      <div className='row'>
        <div className='col-sm-4 mx-auto'>
          <img src={image} alt={name}/>
          <div className='text'>
            <p><span>Address:</span> {location}</p>
            <p><span>Phone number:</span> {phoneNumber}</p>
            <p><span>Rating:</span> {rating}</p> 
            <p><span>Favorite:</span>
              {isFavorite ? <i className="bi bi-hand-thumbs-up-fill"></i> : 
                <i className="bi bi-hand-thumbs-down"></i>}
            </p>             
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails