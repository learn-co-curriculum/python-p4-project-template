import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Home from './components/Home';
import List from './components/List';
import Create from './components/Create';
import RestaurantDetails from './components/RestaurantDetails';
import './stylesheets/app.css';

const App = () => {

  const [restaurants, setRestaurants] = useState([]);  

  useEffect(() => {
    fetch('http://localhost:6001/restaurants')
    .then(res => res.json())
    .then(data => setRestaurants(data));
  }, []);

  function handleUpdateList(updatedRestaurant) {
    const updatedList = restaurants.map(rest => rest.id === updatedRestaurant.id ? updatedRestaurant : rest)
    setRestaurants(updatedList)
  }

  function handleAddRestaurant(data) {
    setRestaurants([...restaurants, data])
  } 

  return (
    <div className='App'>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={
            <Home restaurants={restaurants}
              onUpdateList={handleUpdateList}  
            />} 
          />
          <Route path="/restaurants" element={
            <List restaurants={restaurants} 
              onUpdateList={handleUpdateList} 
            />} 
          />
          <Route path="/restaurants/new" element={<Create onAddRestaurant={handleAddRestaurant}/>} />
          <Route path="/restaurants/:id" element={<RestaurantDetails/>} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
