import React, { useState, useEffect } from 'react';

function DebitPage({ currentUser }) {
  const [debits, setDebits] = useState([]);

  useEffect(() => {
    fetch('/debits')
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setDebits(data));
        }
      });
  }, []);

  return (
    <div>
      <h2>Debit Transactions</h2>
      {debits.map(debit => (
        <h3 key={`debit${debit.id}`}>
          I owe {debit.requestor_username} ${debit.amount}
        </h3>
      ))}
    </div>
  );
}

export default DebitPage;