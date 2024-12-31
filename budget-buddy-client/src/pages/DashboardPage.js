import React from 'react';
import ExpenseList from '../components/ExpenseList';
import AddExpenseForm from '../components/AddExpenseForm';
import Dashboard from '../components/Dashboard';
import '../styles/Dashboard.css';

function DashboardPage() {
    return (
    <div className="dashboard-page">
        <h1>Dashboard</h1>
        <AddExpenseForm />
        <ExpenseList />
        <Dashboard />
    </div>
    );
}

export default DashboardPage;