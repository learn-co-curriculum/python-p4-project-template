import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar/HomeNav";
import "../style.css";

const Cart = () => {
  const [chosenItems, setChosenItems] = useState([]);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setChosenItems(JSON.parse(storedItems));
    }
  }, []);

  const calculateTotalPrice = (items) => {
    if (!items || !Array.isArray(items)) {
      return 0;
    }
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = chosenItems.filter((item) => item.id !== itemId);
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = chosenItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = chosenItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 };
      }
      return item;
    });
    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  return (
    <div>
      <NavBar />
      <div className="cart-container">
        <h3 className="cart-title">Cart Items</h3>
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chosenItems.length > 0 ? (
              chosenItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-food-image"
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="quantity-btn"
                    >
                      ➖
                    </button>
                    {item.quantity}
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="quantity-btn"
                    >
                      ➕
                    </button>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-cart-message">
                  Your cart is empty.
                </td>
              </tr>
            )}
          </tbody>
          {chosenItems.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="5" className="total-label">
                  Total Price:
                </td>
                <td className="total-price">
                  ${calculateTotalPrice(chosenItems).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
        {/* Button to navigate to AllOrdersPage */}
        <button className="view-orders-btn" onClick={() => navigate("/orders")}>
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default Cart;
