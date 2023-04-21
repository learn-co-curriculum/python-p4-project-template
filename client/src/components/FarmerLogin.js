import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Home.css"

function FarmerLogin() {
  const [name, setName] = useState('');
  const history = useHistory();
  const [showForm, setShowForm] = useState(false);
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newFarmerLocation, setNewFarmerLocation] = useState('');
  const [newFarmerImgSrc, setNewFarmerImgSrc] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/farmers')
      .then((response) => response.json())
      .then((data) => {
        const foundFarmer = data.find((farmer) => farmer.name === name);
        if (foundFarmer) {
          history.push({
            pathname: '/farmers/orders',
            state: { 
              farmerName: foundFarmer.name,
              farmerId: foundFarmer.id
            }
          });
        } else {
          alert('Invalid farmer name');
        }
      });
  }

  const handleNewFarmerSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/farmers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newFarmerName,
        location: newFarmerLocation,
        imgSrc: newFarmerImgSrc
      })
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Farmer ${data.name} added successfully!`);
        setNewFarmerName('');
        setNewFarmerLocation('');
        setNewFarmerImgSrc('');
        setShowForm(false);
      });
  }

  const handleNewFarmerCancel = () => {
    setShowForm(false);
  }

  return(
    <div className="header">
      <h1 className="welcome">Farmer Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input className="fc" type="text" placeholder="Sign In" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="farm-button"type="submit">Submit</button>
      </form>
      <div className="drop-down-form" onClick={() => setShowForm(true)}>Become a new customer</div>
        {showForm && (
          <form onSubmit={handleNewFarmerSubmit}>
            <input type="text" placeholder="Name" value={newFarmerName} onChange={(e) => setNewFarmerName(e.target.value)} />
            <input type="text" placeholder="Location" value={newFarmerLocation} onChange={(e) => setNewFarmerLocation(e.target.value)} />
            <input type="text" placeholder="Image Source" value={newFarmerImgSrc} onChange={(e) => setNewFarmerImgSrc(e.target.value)} />
            <button type="submit">Submit</button>
            <button type="button" onClick={handleNewFarmerCancel}>Cancel</button>
          </form>
        )}
      </div>
  )
}

export default FarmerLogin;