import React, { useState, useEffect } from "react";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const username = localStorage.getItem("username");
    const response = await fetch("http://127.0.0.1:5001/expenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Username: username,
      },
    });
    const data = await response.json();
    setExpenses(data);
  };

  const handleDelete = async (id) => {
    const username = localStorage.getItem("username");
    await fetch(`http://127.0.0.1:5001/expenses/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Username: username,
      },
    });
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h3>Your Expenses</h3>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.name} - ${expense.amount} ({expense.category}) on {expense.date}
            <button onClick={() => handleDelete(expense.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;