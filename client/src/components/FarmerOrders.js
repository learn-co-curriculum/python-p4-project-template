import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Farmer.css"
import FarmerNavBar from './FarmerNavBar'

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const farmerName = location.state?.farmerName;

  useEffect(() => {
    if (farmerName) {
      fetch('http://127.0.0.1:5555/orders')
        .then((response) => response.json())
        .then((data) => {
          const farmerOrders = data.filter((order) => order.farmer.name === farmerName);
          setOrders(farmerOrders);
        });
    }
  }, [farmerName]);

  

  return (
    <div>
      <FarmerNavBar farmerName={farmerName}/>
      {farmerName ? (
        <>
          <h2>Orders for {farmerName}</h2>
          {orders.map((order) => (
            <div key={order.id}>
                <p>
                Item: {order.details}
                </p>
            </div>
          ))}
        </>
      ) : (
        <h2>Please log in first</h2>
      )}
    </div>
  );
}

export default FarmerOrders;