import React from 'react';

const SideForm = ({ chosenItems, placeOrder }) => {
  return (
    <div>
      <h3>Chosen Items</h3>
      <ul>
        {chosenItems.map(item => (
          <li key={item.id}>
            <img src={item.image} alt={item.name} className="food-image" />
            <p>{item.name} - Quantity: {item.quantity} - Price: ${item.price}</p>
          </li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default SideForm;
