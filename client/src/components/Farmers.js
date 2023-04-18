import React, { useState, useEffect } from 'react';
import "./Farmer.css"

function Farmers() {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/farmers')
      .then((response) => response.json())
      .then((data) => setFarmers(data));
  }, []);

  return (
    <div>
      {farmers.map((farmer) => (
        <div key={farmer.id}>
            Name: {farmer.name}
            <p>
                --Location: {farmer.location}
            </p>
        </div>
      ))}
    </div>
  );
}

export default Farmers;