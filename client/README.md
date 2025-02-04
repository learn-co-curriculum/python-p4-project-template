# Airbnb Project
## Table of Contents
* Overview
  Technologies Used
* Features
* Installation
 . Backend Setup (Flask)
 . Frontend Setup (Next.js)
* API Endpoints
. *Authentication
. *Properties
. *Bookings
. *Wishlist
. *Reviews
* Project Structure
* Contributors
* License
## Overview
This is a full-stack *Airbnb-like* application that allows users to list properties, make bookings, write reviews, and manage their wishlist. The backend is built with *Flask*, handling authentication, database management, and business logic, while the frontend is built with Next.js, providing a modern and responsive UI.

### Technologies Used
*Backend (Flask)
*Flask: Micro web framework for Python.
*Flask-RESTful: Extension for creating REST APIs.
*Flask-SQLAlchemy: SQLAlchemy integration for Flask.
*Flask-Migrate: Database migration tool for Flask-SQLAlchemy.
*Flask-JWT-Extended: Authentication using JSON Web Tokens.
*Flask-CORS: Cross-Origin Resource Sharing support.
*SQLite/PostgreSQL: Relational databases used for persistence.
### Frontend (Next.js)
* Next.js: React-based framework for building server-side rendered applications.
* Tailwind CSS: Utility-first CSS framework for styling.
* Axios: Promise-based HTTP client for making API requests.
* React Hook Form: Library for handling form validation and submission.
* React Query: Data fetching, caching, and synchronization.
Features
* User Authentication: Users can sign up, log in, and manage their profiles.
* Property Listings: Hosts can create, update, and delete property listings.
* Booking System: Users can book properties and manage reservations.
* Wishlist: Users can add properties to their wishlist for future reference.
* Reviews & Ratings: Guests can leave reviews and ratings for properties.
* Secure Payments: Integration for handling payments (e.g., Stripe or PayPal).
#### Installation
Backend Setup (Flask)
Clone the repository:

```bash
Copy
Edit
git clone https://github.com/yourusername/airbnb-project.git
cd airbnb-project/server
Create and activate a virtual environment:
```
```bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate  # Windows
Install dependencies:
```
```bash
Copy
Edit
pip install -r requirements.txt
Set up the database:
```
```bash
Copy
Edit
flask db init
flask db migrate -m "Initial migration."
flask db upgrade
Seed the database (if applicable):
```
```bash
Copy
Edit
python seed.py
Run the Flask server:
```

```bash
Copy
Edit
flask run
Frontend Setup (Next.js)
Navigate to the client directory:
```
```bash
Copy
Edit
cd ../client
Install dependencies:
```

```bash
Copy
Edit
npm install
Run the Next.js development server:
```

```bash
Copy
Edit
npm run dev
Open the application in your browser:
```
```bash
Copy
Edit
http://localhost:3000
```
### API Endpoints
#### Authentication
* POST /register: Register a new user.
* POST /login: Log in a user.
* GET /user: Get logged-in user details.
#### Properties
* GET /properties: Fetch all properties.
* POST /properties: Create a new property.
* GET /properties/:id: Get a single property by ID.
* PUT /properties/:id: Update a property.
* DELETE /properties/:id: Delete a property.
#### Bookings
* POST /bookings: Create a booking.
* GET /bookings: Get user bookings.
* Wishlist
* POST /wishlist: Add a property to wishlist.
* GET /wishlist: Get wishlist items.
* Reviews
* POST /reviews: Add a review for a property.
* GET /reviews/:property_id: Get reviews for a property.

####  Project Structure

```lua


/airbnb-project
│── client/ (Next.js Frontend)
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── next.config.js
│
│── server/ (Flask Backend)
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   ├── migrations/
│   ├── seed.py
│   ├── requirements.txt
│
│── README.md
│── .gitignore
│── Pipfile
```
#### Contributors
Your Name - GitHub Profile

Feel free to contribute by submitting issues or pull requests!

### License
This project is licensed under the MIT License - see the LICENSE file for details.
