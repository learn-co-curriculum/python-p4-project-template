import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Farmer.css"
import FarmerNavBar from './FarmerNavBar'

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const location = useLocation();
  const farmerName = location.state?.farmerName;

  useEffect(() => {
    if (farmerName) {
      setIsLoading(true); // Set loading state to true before fetching
      fetch(`http://127.0.0.1:5555/orders?farmer=${farmerName}`)
        .then((response) => response.json())
        .then((data) => {
          setOrders(data);
          setIsLoading(false); // Set loading state to false after fetching
        });
    }
  }, [farmerName]);

  if (isLoading) {
    return (
      <div>
        <FarmerNavBar farmerName={farmerName}/>
        <h2>Loading...</h2>
      </div>
    );
  }

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
                    --Quantity: {order.quantity}
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