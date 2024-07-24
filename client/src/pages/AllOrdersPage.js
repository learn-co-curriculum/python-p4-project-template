import React, { useEffect, useState } from "react";
import "../style.css"; // Ensure this path is correct for your project
import HomeNav from "../components/Navbar/HomeNav"; // Adjust the path if necessary

const AllOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://menu-qdlu.onrender.com/api/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched orders:", data); // Debugging line
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = async (newOrder) => {
    try {
      const response = await fetch(
        "https://menu-qdlu.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newOrder),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Added order:", data); // Debugging line

      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      console.error("Error adding order:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="all-orders-page">
      <HomeNav cartItemCount={0} />{" "}
      {/* Include HomeNav with appropriate props */}
      <h3>All Orders</h3>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrdersPage;
