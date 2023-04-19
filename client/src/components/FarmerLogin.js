import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Home.css"
// comment:
function FarmerLogin() {
  const [name, setName] = useState('');
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/farmers')
      .then((response) => response.json())
      .then((data) => {
        const foundFarmer = data.find((farmer) => farmer.name === name);
        if (foundFarmer) {
          history.push({
            pathname: '/farmers/orders',
            state: { farmerName: foundFarmer.name }
          });
        } else {
          alert('Invalid farmer name');
        }
      });
  }

  return(
    <div className="header">
      <h1 className="welcome">WELCOME!</h1>
      <form onSubmit={handleSubmit}>
        <input className="fc" type="text" placeholder="Sign In" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div className="drop-down-form">Create an account</div>
    </div>
  )
}

export default FarmerLogin;