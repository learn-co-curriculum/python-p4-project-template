Space Explorer: Mission Control Center
Welcome to the Space Explorer Mission Control Center, an interactive application designed to fuel your interstellar ambitions. 🚀

This full-stack web application allows users to:

Register/Login: Securely create accounts or log in to save their mission plans.
Choose a Player: Select their spacefarer (astronaut/ robot/ alien) from a diverse roster.
Plan Missions: Design unique missions with destinations, tasks, and required equipment.
Select Spacecraft: Choose the perfect vehicle for the mission based on its capabilities.
Explore Destinations: Learn about different celestial bodies (planets, stars, galaxies).
Features
Interactive Mission Planning: A user-friendly interface to customize and visualize missions.
Player Customization: Choose a unique player with a backstory and special equipment.
Rich Destination Data: Detailed information and images for various celestial bodies.
Task and Equipment Management: Assign tasks and select essential equipment for each mission.
Persistent Data: User data and mission plans are saved for future access.
Technologies
Frontend:
React: A component-based JavaScript library for building user interfaces.
React Router: For handling navigation and managing different views.
React Bootstrap: For styling and UI components.
Backend:
Flask: A lightweight Python web framework.
SQLAlchemy: An ORM (Object-Relational Mapper) for database interaction.
Flask-RESTful: To build the RESTful API.
Flask-JWT-Extended: For implementing JSON Web Token (JWT) authentication.
Flask-CORS: To manage cross-origin resource sharing (CORS) for security.
Getting Started
Prerequisites
Node.js and npm (or yarn): Make sure you have Node.js and either npm or yarn installed on your system to manage frontend dependencies.
Python 3: You'll need Python 3 to run the Flask backend.
Pipenv (recommended): Use Pipenv to manage your Python virtual environment and dependencies for better isolation and reproducibility.
(Optional) PostgreSQL: For production or a more robust database setup, install PostgreSQL.
Installation
Clone the Repository:

Bash
git clone https://github.com/Tripp-L/phase4-space-proj/tree/main
cd https://github.com/Tripp-L/phase4-space-proj/tree/main
code .


Backend Setup:

Navigate to the server directory: cd server
Create a virtual environment (if using Pipenv): pipenv install
Activate the virtual environment: pipenv shell
Install dependencies: pip install -r requirements.txt
Configure database settings in config.py (using SQLite or PostgreSQL).
Run migrations: flask db upgrade
Start the Flask server: flask run (or use a production server like Gunicorn).


Frontend Setup:

Navigate to the client directory: cd client
Install dependencies: npm install (or yarn install)
Start the development server: npm start (or yarn start)


API Endpoints
The Flask backend provides a RESTful API for interacting with the application data:

GET /players: Fetches all players
GET /players/<id>: Fetches a specific player
POST /players: Create new players
PUT /players/<id>: Edit an existing player
DELETE /players/<id>: Delete an existing player
GET /spacecrafts: Fetches all spacecrafts
GET /spacecrafts/<id>: Fetches a specific spacecraft
POST /spacecrafts: Create new spacecrafts
PUT /spacecrafts/<id>: Edit an existing spacecraft
DELETE /spacecrafts/<id>: Delete an existing spacecraft
GET /missions: Fetches all missions
GET /missions/<id>: Fetches a specific mission
POST /missions: Create new missions
PUT /missions/<id>: Edit an existing mission
DELETE /missions/<id>: Delete an existing mission
GET /celestial_bodies: Fetches all celestial bodies
GET /celestial_bodies/<id>: Fetches a specific celestial body
POST /celestial_bodies: Create new celestial bodies
PUT /celestial_bodies/<id>: Edit an existing celestial body
DELETE /celestial_bodies/<id>: Delete an existing celestial body
POST /signup: Creates a new user account
POST /login: Authenticates a user and returns a JWT token if successful