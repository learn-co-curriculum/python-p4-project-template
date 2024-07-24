import React, { useState, useEffect } from "react";

const OrderList = () => {
  // State to store orders
  const [orders, setOrders] = useState([]);

  // Fetch orders from API or database
  useEffect(() => {
    // Example fetch request
    fetch("/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  return (
    <div>
      <h1>Orders List</h1>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.description}</td>
              {/* Add more table cells for additional order details */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
