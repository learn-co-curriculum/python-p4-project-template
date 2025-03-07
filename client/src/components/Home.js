import React, { useState } from 'react'
import Search from './Search'
import "../stylesheets/home.css"
import Restaurant from './Restaurant';

const Home = ({ restaurants, onUpdateList }) => {

  const [search, setSearch] = useState('')
  
  const initialData = {
    name: '',
    image: '../images/default-image.png',
    location: '',
    isFavorite: false,
    phoneNumber: '',
    rating: 0
  }

  function handleSearch(input) {
    setSearch(input)
  }

   const filteredRestaurants = restaurants.filter(rest => rest.name.toLowerCase().includes(search.toLowerCase()))

  const displayRestaurants = filteredRestaurants.map(rest => {
    return (
      <Restaurant key={rest.id} 
        restaurant={rest} 
        onUpdateList={onUpdateList}
      />
    )
  }) 

  return (
    <div  className='home'>
      <h1>Find Your Favorite Local Restaurants</h1>
      <hr className='border-line'/>
      <Search onSearch={handleSearch}/><br/><br/>
      <ul className='cards'>
        {search.length === 0 ? <Restaurant restaurant={initialData}/> : displayRestaurants}        
      </ul>           
    </div>
  )
}

export default Home