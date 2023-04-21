import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Home.css"

function CustomerLogin() {
  const [name, setName] = useState('');
  const history = useHistory();
  const [showForm, setShowForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerPaymentMethod, setNewCustomerPaymentMethod] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/customers')
      .then((response) => response.json())
      .then((data) => {
        const foundCustomer = data.find((customer) => customer.name === name);
        if (foundCustomer) {
          history.push({
            pathname: '/customers/orders',
            state: { 
              customerId: foundCustomer.id,
              customerName: foundCustomer.name 
            }
          });
        } else {
          alert('Invalid customer name');
        }
      });
  }

  const handleNewCustomerSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newCustomerName,
        address: newCustomerAddress,
        payment_method: newCustomerPaymentMethod
      })
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Customer ${data.name} added successfully!`);
        setNewCustomerName('');
        setNewCustomerAddress('');
        setNewCustomerPaymentMethod('');
        setShowForm(false);
      });
  }

  const handleNewCustomerCancel = () => {
    setShowForm(false);
  }

  return(
    <div className="header">
      <h1 className="welcome">Customer Sign In</h1>
      <form onSubmit={handleSubmit}>
        <input className="fc" type="text" placeholder="Sign In" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="farm-button"type="submit">Submit</button>
      </form>
      <div className="drop-down-form" onClick={() => setShowForm(true)}>Become a new customer</div>
      {showForm && (
        <form onSubmit={handleNewCustomerSubmit}>
          <input type="text" placeholder="Name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
          <input type="text" placeholder="Address" value={newCustomerAddress} onChange={(e) => setNewCustomerAddress(e.target.value)} />
          <input type="text" placeholder="Payment Method" value={newCustomerPaymentMethod} onChange={(e) => setNewCustomerPaymentMethod(e.target.value)} />
          <button type="submit">Add Customer</button>
          <button type="button" onClick={handleNewCustomerCancel}>Cancel</button>
        </form>
      )}
    </div>
  )
}

export default CustomerLogin;