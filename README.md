# FREIGHTX

<p align="center">
  <img src="client/src/pics/Freightx.gif" alt="Freightx.gif"/>
</p>

Welcome to FREIGHTX, the ultimate solution for seamless parcel shipments and hassle-free passenger bookings. 
With FREIGHTX, experience the convenience of managing your shipments and travel plans all in one place. 
From secure user authentication to real-time updates on budgets and ship capacities, 
FREIGHTX offers a comprehensive and intuitive platform to meet all your logistics and travel needs. 
Join us and embark on a journey where efficiency meets reliability, and every shipment and booking is just a click away.

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Technologies Used](#technologies-used)
4. [Installation and Setup](#installation-and-setup)
5. [Running the Project](#running-the-project)
6. [Authors](#authors)
7. [License](#license)

## Features

### MVP Features

### User Authentication

#### Sign Up

- **Form Validation**: The sign-up form ensures the correct format for username, email, and password.
- **Account Creation**: Users can create an account with validated details.

#### Log In

- **User Authentication**: Users can log in with their registered credentials.
- **Welcome Dashboard**: Upon successful login, users are welcomed to the dashboard, detailing what the app is about.

### Dashboard

- **Port Selection**: Users can select a port and view ships under that port.
- **Ship Categories**: Ships are categorized under All Ships, Cargo Ships, and Passenger Ships.

### Ship Information

- **Ship Details**: Users can view information about ships, including name, Category, arrival and departure ports, and available number tickets and ticket price.
- **Cargo Ships**: Users can select a shipping contractor from the displayed list.

### Booking Process

- **Book Shipments**: Users can book shipments after selecting a contractor for cargo ships,However for Passanger ship you are not required to choose a contractor
- **Deduct Balance**: The booking amount is deducted from the user's balance after booking.
- **Booking Confirmation**: A pop-up confirms the successful booking, displaying details such as name, type of ship, arrival and departure ports, and time.

### User Account

- **View Balance**: Users can view their remaining balance.
- **Deposit Funds**: Users can deposit more cash to their account.

### Real-time Updates

- **Budget Status**: Displays the user's remaining budget after transactions.
- **Ticket Availability**: Updates the number of available passenger tickets in real-time.

### Stretch Features

- Transaction history

## Project Structure

```
FREIGHTX/
│
├── client/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   ├── README.md
│   └── src/
│       ├── components/
│       │   ├── App.js
│       │   ├── Auth.js
│       │   ├── Footer.js
│       │   ├── Home.js
│       │   ├── Navbar.js
│       │   ├── Passenger.js
│       │   ├── Portcard.js
│       │   ├── Ports.js
│       │   ├── Ship.js
│       │   ├── Shiplist.js
│       │   └── User.js
│       ├── css/
│       ├── index.css
│       ├── index.js
│       └── pics/
│
├── CONTRIBUTING.md
├── LICENSE.md
├── Pipfile
├── Pipfile.lock
├── README.md
│
└── server/
    ├── app.py
    ├── config.py
    ├── instance/
    │   └── app.db
    ├── manage.py
    ├── migrations/
    ├── models.py
    ├── __pycache__/
    └── seed.py

```

### Key Directories and Files

- `client/`: Contains the React frontend application
  - `src/components/`: React components
  - `src/css/`: CSS stylesheets
  - `src/pics/`: Image assets
- `server/`: Contains the Flask backend application
  - `instance/`: Instance-specific configurations
  - `migrations/`: Database migration files
  - `app.py`: Main application file
  - `models.py`: Database models
  - `seed.py`: Database seeding script
- `CONTRIBUTING.md`: Guidelines for contributing to the project
- `LICENSE.md`: Project license information
- `Pipfile` and `Pipfile.lock`: Python dependency management
- `package.json`: Node.js dependency management

## Technologies Used

### Languages

<p align="center">
  <img src="https://media.giphy.com/media/ln7z2eWriiQAllfVcn/giphy.gif" alt="JavaScript" width="70" height="70"/>
  <img src="https://media.giphy.com/media/LMt9638dO8dftAjtco/giphy.gif" alt="Python" width="70" height="70"/>
  <img src="https://media.giphy.com/media/XAxylRMCdpbEWUAvr8/giphy.gif" alt="HTML5" width="70" height="70"/>
  <img src="https://media.giphy.com/media/fsEaZldNC8A1PJ3mwp/giphy.gif" alt="CSS3" width="70" height="70"/>
</p>

### Frameworks

<p align="center">
  <img src="https://media.giphy.com/media/eNAsjO55tPbgaor7ma/giphy.gif" alt="React" width="70" height="70"/>
  <img src="https://www.vectorlogo.zone/logos/pocoo_flask/pocoo_flask-icon.svg" alt="Flask" width="70" height="70"/>
</p>

### Database

<p align="center">
  <img src="https://media.giphy.com/media/W71QxkQgCDM1WJYdFz/giphy.gif" alt="MySQL" width="70" height="70"/>
</p>

### Tools

<p align="center">
  <img src="https://media.giphy.com/media/kH1DBkPNyZPOk0BxrM/giphy.gif" alt="Git" width="100" height="70"/>
  <img src="https://media.giphy.com/media/IdyAQJVN2kVPNUrojM/giphy.gif" alt="VS Code" width="70" height="70"/>
</p>
- Frontend:  React
- Backend: Flask
- Database: MySQL
- Other: Git, npm


#### CSS3
- Application: Custom CSS stylesheets are applied to components like Navbar, Ship, User, ensuring consistent branding and responsive design across different screen sizes.
- Documentation: [CSS Documentation](https://devdocs.io/css/)

#### React
- Application: Components such as Navbar, Home, Ports, Ship, User, etc., leverage React's lifecycle methods, hooks, and context API for dynamic data handling and UI updates.
- Documentation: [React Documentation](https://react.dev/)

#### Flask
- Application: Backend routes (/login, /signup, /ships, /bookings, etc.) are implemented using Flask, with Flask-SQLAlchemy for managing MySQL database models (User, Ship, Booking, etc.).
- Documentation: [Flask Documentation](https://flask.palletsprojects.com/en/3.0.x/)

#### MySQL
- Application: Flask-SQLAlchemy ORM is used to define database models (User, Ship, Booking, etc.), establish relationships between entities, and perform CRUD operations.
- Documentation: [MySQL Documentation](https://dev.mysql.com/doc/)

#### Git
- Application: GitHub repository (Kamau-sam/FREIGHTX) is used for hosting the project, managing commits, branches, and merging pull requests from all the authors.
- Documentation: [Git Documentation](https://git-scm.com/doc)

#### npm
- Application: npm is used to install and manage React dependencies (react, react-dom, etc.) and build tools (webpack, babel, etc.) required for frontend development.
- Documentation: [npm Documentation](https://docs.npmjs.com/)

## Setup Instructions

Clone the Repository

    git clone https://github.com/Kamau-sam/FREIGHTX.git

#### Step 2: Install Dependencies

Navigate to the server directory within the cloned repository

    cd FREIGHTX/server

install the required Python packages using pipenv,by running:

    pipenv install

#### Step 3: Activate the Virtual Environment

Activate the virtual environment created by pipenv by running

     pipenv shell

to ensure that the installed packages are accessible.

### Step 4: Set Up the Database

Initialize the database, apply migrations, and upgrade the database schema by running the following commands:

    python manage.py db init
    python manage.py db migrate
    python manage.py db upgrade

#### Step 5: Seed the Database

Seed the database with initial data by executing:

    python seed.py

#### Step 6: Run the Flask Server

Start the Flask development server to begin serving the application:

    flask run

## Frontend Setup

To set up the frontend part of the FreightX project, proceed with the following instructions:

#### Step 1: Navigate to the Client Directory

Change your current working directory to the client folder located at the root of the project:

    cd ../client

#### Step 2: Install Dependencies

Install the necessary Node.js packages for the frontend development:

    npm install

#### Step 3: Start the React Development Server

Launch the React development server to view the application in your web browser:

    npm start

After completing these steps:

- The backend server should be running on [http://localhost:5000](http://localhost:5000)
- The frontend should be accessible at [http://localhost:3000](http://localhost:3000)

## Authors

- [Kamau-sam](https://github.com/Kamau-sam)
- [All3n0](https://github.com/All3n0)
- [mfavorv](https://github.com/mfavorv)
- [dennysis](https://github.com/dennysis)
- [Gudu-Diana](https://github.com/Gudu-Diana)

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
