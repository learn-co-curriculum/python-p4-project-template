// src/pages/MenuList.js
import React, { useState, useEffect } from 'react';

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error fetching menu items:', error));
  }, []);

  return (
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
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.description}</td>
              <td>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100px' }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuList;

