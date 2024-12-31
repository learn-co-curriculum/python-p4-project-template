# Budget Buddy - Personal Finance Manager

## Overview
**Budget Buddy** is a full-stack web application designed to help users manage their budgets, track expenses, and analyze spending habits. Built using Flask for the backend and React for the frontend, it provides a seamless user experience for tracking personal finances and gaining insights into financial health.

---

## Features
- **User Authentication**: Secure signup and login functionality.
- **Budget Management**: Create and update budgets for different categories.
- **Expense Tracking**: Log daily expenses and assign them to categories.
- **Data Visualization**: View spending habits through charts and graphs.
- **Search and Filter**: Easily search and filter expenses by date, category, or amount.
- **Export Data**: Download financial data as CSV for external use.

---

## Technologies Used
### Frontend
- React.js
- React Router DOM
- Chart.js for visualizations
- CSS for styling

### Backend
- Flask
- Flask-RESTful
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-CORS

### Database
- SQLite

### Others
- Node.js & npm
- Pipenv for Python environment management

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js and npm
- Python 3 and Pipenv

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd budget-buddy
   ```

2. Set up the backend:
   ```bash
   cd server
   pipenv install
   pipenv shell
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   python app.py
   ```

3. Set up the frontend:
   ```bash
   cd client
   npm install
   npm start
   ```

### Accessing the App
- Backend: [http://localhost:5555](http://localhost:5555)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints
### User Routes
- **POST /signup** - Register a new user
- **POST /login** - Log in a user
- **GET /logout** - Log out a user

### Budget Routes
- **GET /budgets** - Fetch all budgets
- **POST /budgets** - Create a new budget
- **PATCH /budgets/:id** - Update a budget
- **DELETE /budgets/:id** - Delete a budget

### Expense Routes
- **GET /expenses** - Fetch all expenses
- **POST /expenses** - Create a new expense
- **PATCH /expenses/:id** - Update an expense
- **DELETE /expenses/:id** - Delete an expense

---

## Database Models
1. **User**
   - id (Primary Key)
   - username
   - email
   - password

2. **Budget**
   - id (Primary Key)
   - name
   - amount
   - user_id (Foreign Key)

3. **Expense**
   - id (Primary Key)
   - description
   - amount
   - category
   - date
   - budget_id (Foreign Key)

---

## Future Features
- **Recurring Expenses**: Automatically add recurring expenses.
- **Mobile Compatibility**: Optimize the app for mobile devices.
- **Goal Setting**: Allow users to set financial goals and track progress.
- **Notifications**: Alert users about budget limits and upcoming bills.

---

## Contributors
- Karina 
- Namima
- Ron