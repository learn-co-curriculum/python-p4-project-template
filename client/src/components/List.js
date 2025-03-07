import React from 'react'
import Restaurant from './Restaurant'
import "../stylesheets/list.css"

const List = ({ restaurants, onUpdateList }) => {

  const restaurantsList = restaurants.map(restaurant => {
    return ( 
      <Restaurant 
        key={restaurant.id} 
        restaurant={restaurant} 
        onUpdateList={onUpdateList} 
      />
    )
  })

  return (
    <div className='list'>
      <h1>List of Restaurants</h1>
      <hr className='border-line'/>
      <ul className='cards'>
        {restaurantsList}
      </ul>      
    </div>
  )
}

export default List