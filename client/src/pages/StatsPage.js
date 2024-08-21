import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function StatsPage({ currentUser }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div>
      <h2>Transaction Statistics</h2>
      
      <div>
        <h3>General Stats</h3>
        <p>Total transactions: {stats.totalTransactions}</p>
        <p>Transactions as sender: {stats.transactionsAsSender}</p>
        <p>Transactions as receiver: {stats.transactionsAsReceiver}</p>
      </div>

      <div>
        <h3>Transaction Partners</h3>
        <ul>
          {stats.transactionPartners.map(partner => (
            <li key={partner.userId}>
              {partner.username}: {partner.transactionCount} transactions, 
              Total amount: ${partner.totalAmount.toFixed(2)} 
              {partner.isFriend ? ' (Friend)' : ''}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Most Active Transaction Partner</h3>
        <p>
          {stats.mostActivePartner.username}: {stats.mostActivePartner.transactionCount} transactions, 
          Total amount: ${stats.mostActivePartner.totalAmount.toFixed(2)}
        </p>
      </div>

      <div>
        <h3>Transaction Distribution</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={stats.transactionPartners}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="transactionCount"
          >
            {stats.transactionPartners.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div>
        <h3>Yearly Transaction Summary</h3>
        <BarChart
          width={600}
          height={300}
          data={stats.yearlyTransactions}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="credit" stackId="a" fill="#8884d8" />
          <Bar dataKey="debit" stackId="a" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
}

export default StatsPage;