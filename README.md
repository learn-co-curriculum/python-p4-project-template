# Bookstore E-commerce System

This is a Flask-based backend for a bookstore e-commerce system with user authentication, book management, commenting, and borrowing features.

## Features
- User Registration and Login
- CRUD operations for Books
- Commenting on Books
- Borrowing Books
- Managing Favorites

## Installation
1. Clone the repository
2. Install dependencies: `pipenv install`
3. Set up the database: `flask db init`, `flask db migrate`, `flask db upgrade`
4. Seed the database: `python server/seed.py`
5. Run the server: `python server/app.py`

## API Endpoints
- Users: `/users`
- Books: `/books`
- Comments: `/comments`
- Favourites: `/favourites`
- Borrowed Books: `/borrowed_books`
