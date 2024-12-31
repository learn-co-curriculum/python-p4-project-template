import React, { useState, useEffect } from "react";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "", date: "" });
    const [error, setError] = useState("");

    // Fetch expenses from the backend
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const username = localStorage.getItem("username");
                const response = await fetch("http://127.0.0.1:5001/expenses", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": username,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch expenses.");
                }
            } catch (error) {
                setError("An error occurred. Please try again.");
            }
        };

        fetchExpenses();
    }, []);

    // Add new expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            const username = localStorage.getItem("username");
            const expenseToAdd = { 
                ...newExpense, 
                amount: parseFloat(newExpense.amount),
            };

            const response = await fetch("http://127.0.0.1:5001/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Username": username,
                },
                body: JSON.stringify(expenseToAdd),
            });

            if (response.ok) {
                const createdExpense = await response.json();
                setExpenses([...expenses, createdExpense]);
                setNewExpense({ name: "", amount: "", category: "", date: "" });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to add expense.");
            }
        } catch (error) {
            setError("An error occurred while adding the expense.");
        }
    };

    // Delete expense
    const handleDeleteExpense = async (id) => {
        try {
            const username = localStorage.getItem("username");
            const response = await fetch(`http://127.0.0.1:5001/expenses/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Username": username,
                },
            });

            if (response.ok) {
                setExpenses(expenses.filter((expense) => expense.id !== id));
            } else {
                setError("Failed to delete expense.");
            }
        } catch (error) {
            setError("An error occurred while deleting the expense.");
        }
    };

    // Calculate summary
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <div>
            <h2>Welcome to Your Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <h3>Summary</h3>
                <p>Total Expenses: {totalExpenses}</p>
                <p>Total Amount Spent: ${totalAmount.toFixed(2)}</p>
            </div>

            <div>
                <h3>Add New Expense</h3>
                <form onSubmit={handleAddExpense}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        required
                    />
                    <select
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Subscriptions">Subscriptions</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                        <option value="Housing">Housing</option>
                    </select>
                    <input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        required
                    />
                    <button type="submit">Add Expense</button>
                </form>
            </div>

            <div>
                <h3>Your Expenses</h3>
                <ul>
                    {expenses.map((expense) => (
                        <li key={expense.id}>
                            {expense.name} - ${expense.amount} ({expense.category}) on{' '}
                            {new Date(expense.date).toLocaleDateString()}
                            <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;