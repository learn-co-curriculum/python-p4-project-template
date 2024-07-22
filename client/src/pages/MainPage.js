import React, { useState, useEffect } from "react";
import HomeNav from "../components/Navbar/HomeNav";
import "../style.css";

const Main = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("https://menu-qdlu.onrender.com/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    const existingItem = chosenItems.find(
      (cartItem) => cartItem.id === item.id
    );
    let updatedItems;

    if (existingItem) {
      updatedItems = chosenItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedItems = [...chosenItems, { ...item, quantity: 1 }];
    }

    setChosenItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const cartItemCount = chosenItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div>
      <HomeNav cartItemCount={cartItemCount} />
      <div className="header-container">
        <h1>Hotel Menu</h1>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="menu-list">
        {menuItems
          .filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => (
            <div key={item.id} className="menu-item card">
              <img src={item.image} alt={item.name} className="food-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p className="price">Price: ${item.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="add-to-cart-button"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Main;
