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
      fetch('http://127.0.0.1:5555/customers')
        .then((response) => response.json())
        .then((data) => {
          const customerOrders = data.filter((customer) => customer.name === customerName);
          setOrders(customerOrders);
        });
    }
  }, [customerName]);

  return (
    <div>
      <FarmerNavBar customerName={customerName}/>
      {customerName ? (
        <>
          <h2>Orders for {customerName}</h2>
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

export default CustomerPage;