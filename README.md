INVENTORGUARD
Date: 2024/6/19
Authors
By

Timothy Saruni
Adida Barack
Stacy Kimilu
Obala Steve
Liz Wachira 
Kevin Kipkosgei
Description
Welcome to InventorGuard, a cutting-edge inventory management solution meticulously engineered to revolutionize how businesses handle their product inventories. Our platform is finely crafted to optimize every facet of inventory operations, offering seamless product management capabilities including detailed editing, deletion, and monitoring of items with comprehensive insights into quantities, pricing, and supplier details. Stay ahead with real-time stock tracking and proactive alerts for low-stock items, ensuring uninterrupted operations. With a robust user registration and authentication system ensuring secure access, InventorGuard empowers enterprises of all sizes. Whether you're a burgeoning startup or a seasoned corporation, harness the power of InventorGuard to efficiently track, manage, and optimize your inventory operations with unparalleled ease and precision.

Project Setup Instructions
To run the InventorGuard system locally, follow these steps:

Prerequisites:
Ensure you have the required tools installed on your device:

Python (for backend development with Flask and FastAPI).
Node.js and npm (for frontend development with React and Vite).
Python (for backend development with Flask and FastAPI). Node.js and npm (for frontend development with React and Vite).

Getting Started
Fork and clone the repository to your local machine:
git clone frontend https://github.com/your-username/INVENTORGUARD.git

backend: https://github.com/saruni13/python-p4-project-template
Navigate to the project directory using the terminal: cd INVENTORGUARD.
3.Backend Setup Navigate to the backend directory:cd server. Create a virtual environment: pipenv install and pipenv shell. Start the Flask application: flask run and pip install fastapi,fastapi dev app.py .

4.Frontend setup Navigate to the frontend directory: cd frontend. Install the required npm packages: npm install. Start the React application using Vite:npm run dev. Open your web browser and go to http://localhost:3000 to see the frontend. The backend will be running on http://localhost:5000.

Features include
Product Management: Add, edit, and delete products with details such as name, SKU, description, quantity, price, and supplier information.
Inventory Tracking: Monitor real-time stock levels and receive notifications for low-stock items.
User Registration and login: login and registration system for authorized access to the system.
Folder Structure
The folder structure of the project is organized as follows:

Backend
Backend
app.py: Main Python file for running the entire backend.
models.py: Contains models for creating tables.
seed.py: Adds initial data and test data to the database.
database.py: Handles database operations using SQLAlchemy.
Frontend
README.md: Markdown file containing information about the project.
frontend: Directory for frontend React application.
components: Reusable UI components.
Header.jsx, Login.jsx, ProductForm.jsx, ProductList.jsx, Registration.jsx, Sidebar.jsx, TransactionForm.jsx, TransactionList.jsx
index.css: Global styles for the frontend.
main.jsx: Entry point for the frontend application.
pages: Different pages or views of the frontend application.
Dashboard.jsx, LoginPage.jsx, ProductsPage.jsx, TransactionsPage.jsx
Routing.jsx: File for routing logic within the frontend.
README.md: Markdown file containing information about the project.
Live Site on GitHub Pages
[Live Site] (https://github.com/saruni13/INVENTORGUARD)

Technologies Used
React: A JavaScript library for building user interfaces.
Vite: A fast build tool that focuses on speed and simplicity.
Flask: A lightweight WSGI web application framework in Python, used for building the backend of the application.
FastAPI: A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
SQLAlchemy: A SQL toolkit and Object-Relational Mapping (ORM) library for Python, used for interacting with the database in the Flask application.
CSS: Used for structuring and styling the web application.
Backend Repository
[Backend Repository] (https://github.com/saruni13/python-p4-project-template)

Support and Contact Details
If you have any inquiries or suggestions, feel free to reach out:

GitHub: [INVENTORGUARD] (https://github.com/saruni13/INVENTORGUARD)
License
The content of this site is licensed under the MIT license.

© 2024 Timothy Saruni, Adida Barack, Stacy Kimilu, Obala Steve, Kevin Kipkosgei, Liz Wachira.