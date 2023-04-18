// import "./Customer.css"
import React, { useState, useEffect } from 'react';
import "./Customer.css"
import CustomerNavBar from './CustomerNavBar'

function Customer() {
  const [customers, setCustomer] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/customers')
      .then((response) => response.json())
      .then((data) => setCustomer(data));
  }, []);

  return (
    <div>
        <CustomerNavBar/>
      {customers.map((customer) => (
        <div key={customer.id}>
            Name: {customer.name}
            <p>
                --Location: {customer.address}
                --Payment: {customer.payment_method}
            </p>
        </div>
      ))}
    </div>
  );
}

export default Customer;