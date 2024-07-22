import React, { useState, useEffect } from "react";
import "../style.css";
import Navbar from "../components/Navbar/NavBar";

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch("https://menu-qdlu.onrender.com/menu")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched menu items:", data);
        setMenuItems(data);
      })
      .catch((error) => console.error("Error fetching menu items:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="menu-list">
        <h1 className="menu-header">Menu List</h1>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.description}</td>
                <td>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ maxWidth: "100px" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuList;
