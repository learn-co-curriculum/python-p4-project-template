import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import "./Home.css"

function CustomerLogin() {
  const [name, setName] = useState('');
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://127.0.0.1:5555/customers')
      .then((response) => response.json())
      .then((data) => {
        const foundCustomer = data.find((customer) => customer.name === name);
        if (foundCustomer) {
          history.push({
            pathname: '/customers/orders',
            state: { customerName: foundCustomer.name }
          });
        } else {
          alert('Invalid customer name');
        }
      });
  }

  return(
    <div className="header">
      <h1 className="welcome">WELCOME!</h1>
      <form onSubmit={handleSubmit}>
        <input className="fc" type="text" placeholder="Sign In" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      <div className="drop-down-form">Become a new customer</div>
    </div>
  )
}

export default CustomerLogin;