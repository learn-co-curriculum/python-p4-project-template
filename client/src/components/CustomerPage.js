import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Farmer.css"
import FarmerNavBar from './FarmerNavBar'

function CustomerPage() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const customerName = location.state?.customerName;

  useEffect(() => {
    if (customerName) {
      fetch('http://127.0.0.1:5555/orders')
        .then((response) => response.json())
        .then((data) => {
          const customerOrders = data.filter((order) => order.customer.name === customerName);
          setOrders(customerOrders);
        });
    }
  }, [customerName]);

  const handleDeleteOrder = (orderId) => {
    fetch(`http://127.0.0.1:5555/orders/${orderId}`, {
      method: 'DELETE'
    })
    .then(() => {
      const newOrders = orders.filter((order) => order.id !== orderId);
      setOrders(newOrders);
    })
    .catch((error) => console.error(error));
  }

  return (
    <div>
      <FarmerNavBar customerName={customerName}/>
      {customerName ? (
        <>
          <h2>Profile for {customerName}</h2>
          {orders.map((order) => (
            <div key={order.id}>
                <p>
                Item: {order.details} -- Farmer: {order.farmer.name}
                </p>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
            </div>
          ))}
        </>
      ) : (
        <h2>Please log in first</h2>
      )}
    </div>
  );
}

export default CustomerPage;