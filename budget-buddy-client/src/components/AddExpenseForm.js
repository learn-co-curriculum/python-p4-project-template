import React, { useState } from "react";

function AddExpenseForm({ fetchExpenses }) {
  const [expense, setExpense] = useState({ name: "", amount: "", category: "", date: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      const response = await fetch("http://127.0.0.1:5001/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Email: email,
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        setExpense({ name: "", amount: "", category: "", date: "" });
        fetchExpenses(); // Refresh the expense list
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={expense.name}
        onChange={(e) => setExpense({ ...expense, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={expense.amount}
        onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
        required
      />
      <select
        value={expense.category}
        onChange={(e) => setExpense({ ...expense, category: e.target.value })}
      >
        <option value="Food">Food</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Subscriptions">Subscriptions</option>
        <option value="Miscellaneous">Miscellaneous</option>
        <option value="Housing">Housing</option>
      </select>
      <input
        type="date"
        value={expense.date}
        onChange={(e) => setExpense({ ...expense, date: e.target.value })}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default AddExpenseForm;