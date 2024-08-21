import React, { useState, useEffect } from 'react';

function CreditPage({ currentUser }) {
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    fetch('/credits')
      .then(res => {
        if (res.status === 200) {
          res.json().then(data => setCredits(data));
        }
      });
  }, []);

  return (
    <div>
      <h2>Credit Transactions</h2>
      {credits.map(credit => (
        <h3 key={`credit${credit.id}`}>
          {credit.requestee_username} owes me ${credit.amount}
        </h3>
      ))}
    </div>
  );
}

export default CreditPage;