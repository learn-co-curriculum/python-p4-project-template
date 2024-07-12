import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideForm from './SideForm';

const MainPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const placeOrder = () => {
    history.push('/orders', { cartItems });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <h1>Hotel Menu</h1>
      <input
        type="text"
        placeholder="Search for food..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="menu-list">
        {filteredMenuItems.map(item => (
          <div key={item.id} className="menu-item card">
            <img src={item.image} alt={item.name} className="food-image" />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <SideForm chosenItems={cartItems} placeOrder={placeOrder} />
    </div>
  );
};

export default MainPage;
