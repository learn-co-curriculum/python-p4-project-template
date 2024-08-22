import React, { useState, useEffect } from 'react';
import TransactionRequest from './TransactionRequest';
import "./Transaction.css"

export default function Transactions({ currentUser }) {
  const [debits, setDebits] = useState([]);
  const [credits, setCredits] = useState([]);
  const [payments, setPayments] = useState([])

  // Function to fetch debits from the server
  const fetchDebits = () => {
    fetch('/debits')
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(data => setDebits(data));
  };

  // Function to fetch credits from the server
  const fetchCredits = () => {
    fetch('/credits')
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(data => setCredits(data));
  };

  const fetchPayments = () =>{
    fetch('payments')
     .then(res => {
      if (res.status == 200){
        return res.json()
      }
     })
     .then(data => setPayments(data))
  }

  useEffect(() => {
    fetchDebits();
    fetchCredits();
    fetchPayments();
  }, []);


  // Function to create a new transaction request
  const createRequest = (content) => {
    fetch('/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(content),
    }).then(() => {
      fetchDebits();
      fetchCredits();
    });
  };


  // Function to handle payment (deleting a transaction)
  const handleRequest = (e) => {
    e.preventDefault();
    const transaction_id = e.target.parentNode.id;
    fetch(`/request/${transaction_id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        fetchDebits();
        fetchCredits();
        fetchPayments();
      }
    });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const transaction_id = e.target.parentNode.id;
    fetch(`/payment/${transaction_id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    }).then((res) => {
      if (res.ok) {
        fetchDebits();
        fetchCredits();
        fetchPayments();
      }
    });
  };

  return (
    <>

      {debits.length > 0 &&(<div>
      <div className="transaction-list">Pending Requests:</div>
      {debits.map(debit => (
        <h3 key={`debit${debit.id}`} id={debit.id}>
        {debit.requestor_username} requests ${debit.amount} for {debit.description}
          <button className="receive-cash" onClick={handleRequest}>💸</button>
        </h3>
      ))}
      </div>)}
      
      { credits.length > 0 && (
        <div>
        <div className="transaction-list">Pending Payments</div>
        {credits.map(credit => (
          <h3 key={`credit${credit.id}`}>
          Pending ${credit.amount} from {credit.requestee_username} for {credit.description}
          </h3>
        ))}
        </div>
        )}

      {payments.length > 0 && (<div>
      <div className="transaction-list">Incoming Payments</div>
      {payments.map(payment => (
        <h3 key = {`payment${payment.id}`} id ={payment.id}>
          {payment.requestor_username} sent you ${payment.amount} for {payment.description}
        <button className="receive-cash" onClick={handlePayment}>✔️</button>
      </h3>
      ))}
      </div>)}

      <TransactionRequest createRequest={createRequest} currentUser={currentUser} />

    </>
  );
}




