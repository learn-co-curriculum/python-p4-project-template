// 1. pi graph of ratio of how many transaction for between different users with login user, with number counts and ratio
// 2. pi graph of ratio of how many credit  transaction for between different users with login user, with number counts and ratio
// 3. pi graph of ratio of how many debit transaction for between different users with login user, with number counts and ratio
// 4. Pi graph of the ratio of debit and credit transaction of login user and number counts
// 5. pi graph with complete transactions and pending transaction(incomplete) about the ratio and detailed counts numbers, this is up to attributes status or state( complete move to transaction history, and change this this attributes, probably ’True” or “False” control states)
// 6. pi graph of ratio of total credit transaction amounts  between different users and  login user, with total credit amounts number between login user and each other user and ratio.
// 7. Same thing for debit, pi graph of ratio of total debit transaction amounts  between different users and login user, with total debit amounts number between login user and each other user and ratio.
// 8. Finally, pi graph of ratio of total transaction amounts between different users and  login user, which sum up the credit amounts and debit amounts, and it will show total transaction amounts number between login user and each other user and ratio. 



import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function StatsPage({ currentUser }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      <h2>Transaction Statistics</h2>

      <h3>Transaction Ratio (Users)</h3>
      <PieChart width={400} height={400}>
        <Pie data={stats.userTransactionRatios} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="ratio">
          {stats.userTransactionRatios.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default StatsPage;