import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ currentUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/transactions')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched transactions:', data);
        setTransactions(data);
        setFilteredTransactions(data);
      })
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactionType, searchTerm, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (transactionType !== 'all') {
      filtered = filtered.filter(t => {
        if (transactionType === 'credit') {
          return (t.type === 'received' && t.payment_method === 'request') || 
                 (t.type === 'sent' && t.payment_method === 'payment');
        } else if (transactionType === 'debit') {
          return (t.type === 'sent' && t.payment_method === 'request') || 
                 (t.type === 'received' && t.payment_method === 'payment');
        }
        return false;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm) ||
        t.other_username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const renderTransaction = (transaction) => {
    let fromTo;
    let transactionClass;

    if (transaction.type === 'received' && transaction.payment_method === 'request') {
      fromTo = `${transaction.other_username}`;
      transactionClass = 'debit';
    } else if (transaction.type === 'sent' && transaction.payment_method === 'payment') {
      fromTo = `${transaction.other_username}`;
      transactionClass = 'debit';
    } else if (transaction.type === 'sent' && transaction.payment_method === 'request') {
      fromTo = `${transaction.other_username}`;
      transactionClass = 'credit';
    } else {
      fromTo = `${transaction.other_username}`;
      transactionClass = 'credit';
    }

    return (
      <div key={transaction.id} className={`transaction-item ${transactionClass}`}>
        <p>{fromTo}</p>
        <p>Amount: ${transaction.amount}</p>
        <p>Description: {transaction.description}</p>
        <p>Status: {transaction.status}</p>
      </div>
    );
  };

  return (
    <div className="transaction-history">
      <h1>Transaction History</h1>
      
      <div className="filters">
        <select 
          value={transactionType} 
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="all">All Transactions</option>
          <option value="credit">Debit</option>
          <option value="debit">Credit</option>
        </select>

        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="transactions-list">
        {filteredTransactions.map(renderTransaction)}
      </div>
    </div>
  );
};

export default TransactionHistory;