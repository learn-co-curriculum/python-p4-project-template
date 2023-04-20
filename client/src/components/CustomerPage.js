import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Farmer.css"
import FarmerNavBar from './FarmerNavBar'

function CustomerPage() {
  const [orders, setOrders] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const location = useLocation();
  const customerName = location.state?.customerName;
  const customerId = location.state?.customerId;

  useEffect(() => {
    if (customerName) {
      fetch('http://127.0.0.1:5555/orders')
        .then((response) => response.json())
        .then((data) => {
          const customerOrders = data.filter((order) => order.customer.name === customerName);
          setOrders(customerOrders);
        });

      fetch('http://127.0.0.1:5555/farmers')
        .then((response) => response.json())
        .then((data) => {
          setFarmers(data);
        });
    }
  }, [customerName]);

  const deleteOrder = (id) => {
    fetch(`http://127.0.0.1:5555/orders/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setOrders(orders.filter((order) => order.id !== id));
    });
  };

  const addOrder = (event) => {
    event.preventDefault();
    const details = event.target.details.value;
    const farmer_id = event.target.farmer_id.value;

    fetch('http://127.0.0.1:5555/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        details: details,
        customer_id: customerId,
        farmer_id: farmer_id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders([...orders, data]);
      });

    event.target.reset();
  };

  return (
    <div>
      <FarmerNavBar 
      customerName={customerName}
      customerId={customerId}/>
      {customerName ? (
        <>
          <h2>Profile for {customerName}</h2>
          <form onSubmit={addOrder}>
            <label htmlFor="details">Details:</label>
            <input type="text" id="details" name="details" />
            <label htmlFor="farmer_id">Farmer:</label>
            <select id="farmer_id" name="farmer_id">
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </option>
              ))}
            </select>
            <button type="submit">Add Order</button>
          </form>
          {orders.map((order) => (
            <div key={order.id}>
              <p>
                Item: {order.details} -- Farmer: {order.farmer.name}
                <button onClick={() => deleteOrder(order.id)}>Delete</button>
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