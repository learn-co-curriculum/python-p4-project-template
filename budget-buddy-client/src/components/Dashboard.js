import React, { useState, useEffect } from "react";

function Dashboard() {
    // State variables
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ name: "", amount: "", category: "", date: "" });
    const [categories, setCategories] = useState(["Food", "Entertainment", "Subscriptions", "Miscellaneous", "Housing"]);
    const [newCategory, setNewCategory] = useState(""); // Custom categories
    const [editingExpense, setEditingExpense] = useState(null); // Track which expense is being edited
    const [error, setError] = useState(""); // Validation error message

    // Fetch all expenses when the component loads
    useEffect(() => {
        fetchExpenses();
    }, []);

    // Fetch expenses from backend
    function fetchExpenses() {
        const username = localStorage.getItem("username"); // Get the logged-in user's username
        fetch("http://127.0.0.1:5001/expenses", {
            headers: { "Content-Type": "application/json", "Username": username },
        })
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error("Failed to fetch expenses:", error));
    }

    // Add or update an expense
    function handleAddOrUpdateExpense(event) {
        event.preventDefault();
    
        const expenseToValidate = editingExpense || newExpense; // Choose the correct object
    
        // Validation
        if (!expenseToValidate.name || !expenseToValidate.amount || !expenseToValidate.category || !expenseToValidate.date) {
            setError("All fields are required.");
            return;
        }

        if (parseFloat(expenseToValidate.amount) <= 0) {
        setError("Amount must be greater than 0.");
        return;
        }
    
        const username = localStorage.getItem("username"); // Get the logged-in user's username
        const url = editingExpense
            ? `http://127.0.0.1:5001/expenses/${editingExpense.id}`
            : "http://127.0.0.1:5001/expenses";
        const method = editingExpense ? "PATCH" : "POST";
    
        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json", "Username": username },
            body: JSON.stringify(expenseToValidate),
        })
            .then((response) => response.json())
            .then(() => {
                fetchExpenses(); // Refresh the expense list
                setNewExpense({ name: "", amount: "", category: "", date: "" }); // Clear the form
                setEditingExpense(null); // Exit edit mode
                setError(""); // Clear error message
            })
            .catch((error) => console.error("Failed to add/update expense:", error));
    }    

    // Delete an expense
    function handleDeleteExpense(expenseId) {
        const username = localStorage.getItem("username");
        fetch(`http://127.0.0.1:5001/expenses/${expenseId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Username": username },
        })
            .then(() => fetchExpenses()) // Refresh the expense list
            .catch((error) => console.error("Failed to delete expense:", error));
    }

    // Add a new custom category
    function handleCreateCategory() {
        if (!newCategory.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        if (categories.includes(newCategory.trim())) {
            setError("Category already exists.");
            return;
        }

        setCategories([...categories, newCategory.trim()]); // Add the new category
        setNewCategory(""); // Clear the input
        setError(""); // Clear error message
    }

    // Calculate totals
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    // Breakdown by category
    const categoryBreakdown = expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += parseFloat(expense.amount || 0);
        return acc;
    }, {});

    return (
        <div>
            <h2>Welcome to Your Dashboard</h2>

            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Summary */}
            <div>
                <h3>Summary</h3>
                <p>Total Expenses: {totalExpenses}</p>
                <p>Total Amount Spent: ${totalAmount.toFixed(2)}</p>
                <h4>Breakdown by Category:</h4>
                <ul>
                    {Object.entries(categoryBreakdown).map(([category, amount]) => (
                        <li key={category}>
                            {category}: ${amount.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Expense Form */}
            <form onSubmit={handleAddOrUpdateExpense}>
                <h3>{editingExpense ? "Update Expense" : "Add New Expense"}</h3>
                <input
                    type="text"
                    placeholder="Expense Name"
                    value={editingExpense ? editingExpense.name : newExpense.name}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, name: e.target.value })
                            : setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={editingExpense ? editingExpense.amount : newExpense.amount}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, amount: e.target.value })
                            : setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    required
                />
                <select
                    value={editingExpense ? editingExpense.category : newExpense.category}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, category: e.target.value })
                            : setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={editingExpense ? editingExpense.date : newExpense.date}
                    onChange={(e) =>
                        editingExpense
                            ? setEditingExpense({ ...editingExpense, date: e.target.value })
                            : setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    required
                />
                <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
            </form>

            {/* Create Category */}
            <div>
                <h3>Create New Category</h3>
                <input
                    type="text"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleCreateCategory}>Add Category</button>
            </div>

            {/* List of Expenses */}
            <h3>Your Expenses</h3>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.name} - ${expense.amount} ({expense.category}) on {expense.date}
                        <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                        <button onClick={() => setEditingExpense(expense)}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;