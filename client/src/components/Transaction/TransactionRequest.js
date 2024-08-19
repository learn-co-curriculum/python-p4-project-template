import React, { useState, useEffect } from 'react';

function TransactionRequest({ createRequest, currentUser }) {

  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState('sender'); 


  useEffect(() => {
    fetch('/users')

      .then(res => res.json())
      .then(data => setUsers(data.filter(user => user.id !== currentUser.id)));
  }, [currentUser.id]);


  function handleSubmit(e) {
    e.preventDefault();
    const requestData = {
      amount: parseFloat(amount),
      year: parseInt(year),
      [userRole === 'sender' ? 'requestee' : 'requestor']: parseInt(selectedUser),
      [userRole === 'sender' ? 'requestor' : 'requestee']: currentUser.id
    };
    createRequest(requestData);
    setAmount('');
    setSelectedUser('');
    setYear(new Date().getFullYear());
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>New Transaction:</h3>
      
      <div>
        <label>
          <input
            type="radio"
            value="sender"
            checked={userRole === 'sender'}
            onChange={() => setUserRole('sender')}
          />
          Payment
        </label>
        <label>
          <input
            type="radio"
            value="receiver"
            checked={userRole === 'receiver'}
            onChange={() => setUserRole('receiver')}
          />
          Request
        </label>
      </div>


      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
        <option value="">Select a User</option>
        {users.map(user => (
          <option key={user.id} name = "user" value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      
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

      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default TransactionRequest;
