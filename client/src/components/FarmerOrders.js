import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FarmerNavBar from './FarmerNavBar'
// import OrderForm from './OrderForm'

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  // const [customers, setCustomers] = useState([]);
  const location = useLocation();
  const farmerName = location.state?.farmerName;
  // const farmerId = location.state?.farmerId;
//   const orderComponents = orders.map( orderObj => {
//     return <OrderCard key={ orderObj.name } order={ orderObj } />
// } )

  useEffect(() => {
    if (farmerName) {
      fetch('http://127.0.0.1:5555/orders')
        .then((response) => response.json())
        .then((data) => {
          const farmerOrders = data.filter((order) => order.farmer.name === farmerName);
          setOrders(farmerOrders);
        });
    }
  }, [farmerName]);

  const deleteOrder = (id) => {
    fetch(`http://127.0.0.1:5555/orders/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setOrders(orders.filter((order) => order.id !== id));
    });
  };

  return (
    <div>
      <FarmerNavBar farmerName={farmerName}/>
      {farmerName ? (
        <>
          <h2>Orders for {farmerName}</h2>
          {orders.map((order) => (
            <div key={order.id}>
                <p>
                Customer: {order.customer.name} | 
                Item: {order.details} | 
                Card#: {order.customer.payment_method}
                <button onClick={() => deleteOrder(order.id)}>Ship Order</button>
                </p>
            </div>
          ))}
        </>
          ) : (
            <h2>Please log in first</h2>
        )}
      {/* <div className="ui grid container">
            { orderComponents }
      </div> */}
    </div>
  );
}

export default FarmerOrders;