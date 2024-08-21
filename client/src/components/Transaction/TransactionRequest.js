import React, { useState, useEffect } from 'react';
import './TransactionRequest.css'

function TransactionRequest({ createRequest, currentUser }) {

  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [users, setUsers] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('')
  const [description, setDescription] = useState('')
  // const [userRole, setUserRole] = useState('sender'); 


  useEffect(() => {
    fetch('/friends')

      .then(res => res.json())
      .then(data => setUsers(data.filter(user => user.id !== currentUser.id)));
  }, [currentUser.id]);


  function handleSubmit(e) {
    e.preventDefault();
    const requestData = {
      amount: parseFloat(amount),
      year: parseInt(year),
      payment_method:paymentMethod,
      requestee:selectedUser,
      description:description
      //,
      // [userRole === 'sender' ? 'requestee' : 'requestor']: parseInt(selectedUser),
      // [userRole === 'sender' ? 'requestor' : 'requestee']: currentUser.id
    };
    console.log(requestData)
    createRequest(requestData);
    setAmount('');
    setSelectedUser('');
    setPaymentMethod('');
    setYear(new Date().getFullYear());
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="request-form">
      <h3>Send a payment or request using the form below:</h3>
      
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
        <option value="">Select Friend</option>
        {users.map(user => (
          <option key={user.id} name = "user" value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <div className='payment-type'>
        <input
          type="radio"
          id="payment"
          value="payment"
          name="payment_method"
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <label htmlFor="payment">
          Payment
        </label>
        
        <input
          type="radio"
          id="request"
          value="request"
          name="payment_method"
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <label htmlFor="request">
          Request
        </label> 
      </div>

      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />

      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Year"
        min="1900"
        max="2099"
        step="1"
        required
      />
      <input
      type = "text"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="What's this for?"
      required>
      </input>

      <button type="submit">Send</button>
    </form>
  );
}

export default TransactionRequest;
