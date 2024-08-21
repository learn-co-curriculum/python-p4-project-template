
import React, { useState, useEffect } from 'react';
import TransactionRequest from './TransactionRequest';


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
    const transaction_to_delete = e.target.parentNode.id;
    fetch('/request', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id: transaction_to_delete }),
    }).then((res) => {
      if (res.status === 204) {
        setDebits((debits) => debits.filter((debit) => debit.id !== parseInt(transaction_to_delete)));
      }
    });
  };

    // Function to handle payment (deleting a transaction)
    const handlePayment = (e) => {
      e.preventDefault();
      const transaction_to_delete = e.target.parentNode.id;
      console.log(transaction_to_delete)
      fetch('/payment', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ id: transaction_to_delete }),
      }).then((res) => {
        if (res.status === 204) {
          setPayments((payments) => payments.filter((payment) => payment.id !== parseInt(transaction_to_delete)));
        }
      });
    };

    // Implement a handle payment.  
    // In debit mapping have a button to delete the transaction
    // needs a handleDelete or handlePay

    // const handlePayment = (e) =>{
    //     e.preventDefault()
    //     // console.log(e.target.parentNode.id)
    //     const transaction_to_delete = e.target.parentNode.id
    //     fetch('/payment', {
    //         method:'DELETE',
    //         headers:{
    //             'Content-type':'application/json',
    //             'Accept':'application/json'
    //         },
    //         body:JSON.stringify({id:transaction_to_delete})
    //     })
    //     .then( res => {
    //         if(res.status == 204){
    //             setDebits((debits) => debits.filter((debit) => debit.id !==parseInt(transaction_to_delete)))
    //         }
            
    //         })

    //     // .then(res => res.json())
    //     // .then(data => setDebits((data) => data.filter((debit) => debit.id !== e.target.parentNode.id)))
    // }

  return (
    <>

      {debits.length > 0 &&(<div>
      <div>Pending Requests:</div>
      {debits.map(debit => (
        <h3 key={`debit${debit.id}`} id={debit.id}>
        {debit.requestor_username} requests ${debit.amount} in {debit.year} for {debit.description}
          <button onClick={handleRequest}>💸</button>
        </h3>
      ))}
      </div>)}
      
      { credits.length > 0 && (
        <div>
        <div>Pending Payments:</div>
        {credits.map(credit => (
          <h3 key={`credit${credit.id}`}>
          Pending ${credit.amount} from {credit.requestee_username} in {credit.year} for {credit.description}
          </h3>
        ))}
        </div>
        )}

      {payments.length > 0 && (<div>
      <div>Incoming payments:</div>
      {payments.map(payment => (
        <h3 key = {`payment${payment.id}`} id ={payment.id}>
          {payment.requestor_username} sent you ${payment.amount} for {payment.description}
        <button onClick={handlePayment}>✔️</button>
      </h3>
      ))}
      </div>)}

      <TransactionRequest createRequest={createRequest} currentUser={currentUser} />

    </>
  );
}




