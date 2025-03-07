import React, { useState } from 'react'
import "../stylesheets/create.css"

const Create = ({ onAddRestaurant }) => {
  const initialNewRestaurant = { name: '', image: '', location: '', isFavorite: false, phoneNumber: '', rating: 0 }
  const [ newRestaurant, setNewRestaurant ]= useState(initialNewRestaurant)
  
  const { name, image, location, phoneNumber, rating } = newRestaurant

  function handleChange(e) {
    const { name, value } = e.target
    setNewRestaurant({...newRestaurant, [name]: value})
  }

  function handleCheck(e) {
    const { name, checked } = e.target
    setNewRestaurant({...newRestaurant, [name]: checked})
  }

  function handleSubmit(e) {
    e.preventDefault()
    const restaurantData = {
      name: newRestaurant.name,
      image: newRestaurant.image,
      location: newRestaurant.location,
      isFavorite: newRestaurant.isFavorite,
      phoneNumber: newRestaurant.phoneNumber,
      rating: newRestaurant.rating
    }
    fetch('http://localhost:6001/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(restaurantData)
    })
     .then(res => res.json())
     .then(restaurant => {
        console.log(restaurant)
        onAddRestaurant(restaurant)
      })
    setNewRestaurant(initialNewRestaurant)
  }

  return (
    <div className="create">
      <div className='new-restaurant-form'>
        <h1>New Restaurant</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
            <input type="text" className="form-control" 
              name="name" aria-describedby="nameHelp" 
              value={name} onChange={handleChange}
            />
            <div id="namelHelp" className="form-text">It could be your favorite restaurant...</div>
          </div>
          <div className="mb-3">
            <label htmlFor="restaurantImage" className="form-label">Image Link</label>
            <input type="text" className="form-control" 
              name="image" value={image} onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input type="text" className="form-control" 
              name="location" value={location}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <input type="text" className="form-control" 
              name="phoneNumber" value={phoneNumber} onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rating" className="form-label">Rating</label>
            <input step="0.1" type="number" className="form-control" 
              name="rating" value={rating}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" 
              name="isFavorite" onChange={handleCheck}
            />
            <label className="form-check-label" htmlFor="isFavorite">Favorite</label>
          </div>
          <button type="submit" className="btn btn-light">Submit</button>
        </form>
      </div>      
    </div>
  )
}

export default Create