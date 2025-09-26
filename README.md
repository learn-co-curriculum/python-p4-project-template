# D-TRACK: Diabetes Management App

A full-stack diabetes management application that helps patients log glucose readings, understand trends, get local food guidance, set reminders, and contact their doctor. Built with a Flask API backend and a React frontend. Localized for Kenya with bilingual (English/Swahili) support and local food insights.

## Table of Contents
- Overview
- Features
- Tech Stack
- Project Structure
- Getting Started
- Running the App
- API Overview
- Data Models & Relationships
- Forms & Validation
- Client-side Routing
- Troubleshooting

## Overview

This app provides a centralized dashboard for recent readings, BMI, insights and education. It includes personalized food recommendations based on latest glucose status, BMI category, and localized Kenyan guidance. Users can set reminders, message their doctor, and track progress.

## Features

- Readings: Fasting, pre-meal, post-meal, bedtime, random.
- Trends: Glucose chart (last 30 readings), BMI trend, summary cards.
- Food guidance: “What to eat now” with reasons/tags (low-GI, high-fiber, etc.).
- Reminders: Medication and check-in reminders with schedules.
- Doctor contact: Assigned doctor card with call/email; secure messaging with emergency flag.
- Education: Localized tips and onboarding education.
- Gamification: Progress and badges (optional module).

## Tech Stack

- Frontend: React, React Router, Formik + Yup, Recharts, vanilla CSS.
- Backend: Flask, Flask-RESTful, Flask-JWT-Extended, Flask-CORS, Flask-Migrate, SQLAlchemy, Marshmallow.
- Database: SQLite (development).

## Project Structure

```text
Diabetes-Management-App/
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ App.js, NavBar.js, Dashboard.js, Readings.js, profile.js
│  │  │  ├─ education.js, Smartalert.js, DoctorMessages.js, Reminders.js
│  │  │  ├─ LanguageContext.js, AuthContext.js
│  │  ├─ index.js, index.css
│  └─ package.json
├─ server/
│  ├─ app.py, config.py, schema.py, models.py
│  ├─ migrations/
└─ README.md
```

## Getting Started

### Prerequisites

- Node.js >= 16
- Python >= 3.9

### Backend Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r server/requirements.txt
   ```
3. Initialize the database (SQLite by default):
   ```bash
   export FLASK_APP=server/app.py
   flask db upgrade || (flask db init && flask db migrate && flask db upgrade)
   ```
4. (Optional) Seed sample doctors with phone numbers:
   ```bash
   curl -X POST http://localhost:5555/doctors/seed
   ```

### Frontend Setup

```bash
cd client
npm install
```

## Running the App

### Start the Backend

```bash
python server/app.py
# or
FLASK_APP=server/app.py flask run -p 5555
```

### Start the Frontend

```bash
cd client
npm start
```

By default, the backend runs on [http://localhost:5555](http://localhost:5555) and the frontend on [http://localhost:3000](http://localhost:3000).

## 🚀 Key Features

### **Core Diabetes Management**
- Blood sugar tracking with color-coded results
- Medication reminders with overdue detection
- BMI calculator with health insights
- Doctor-patient relationship management

###  **Kenyan Localization**
- **Bilingual Support**: Full English/Swahili interface
- **Local Food Database**: 8 traditional foods (ugali, sukuma wiki, chapati, etc.)
- **Cultural Context**: NHIF integration, traditional herbs awareness
- **Local Statistics**: Kenya-specific diabetes education

### **Smart Features**
- **AI-Powered Alerts**: Glucose pattern analysis and predictions
- **Food Impact Predictor**: Personalized recommendations for Kenyan foods
- **Gamification**: Daily challenges, badges, progress tracking
- **Interactive Education**: Diabetes lessons with quizzes

## 🏗️ Technical Architecture

### Backend (Flask API)

```text
server/
├── app.py                 # Main Flask application with 15+ API endpoints
├── config.py             # Database and app configuration
├── models.py             # 5 SQLAlchemy models with relationships
├── seed.py               # Sample data including Kenyan doctors and foods
├── kenyan_foods.py       # Local food database with glucose impact data
├── glucose_predictor.py  # AI pattern analysis and predictive alerts
├── gamification.py       # Badge system and daily challenges
└── migrations/           # Database migration files
```

### Frontend (React SPA)

```text
client/src/
├── components/
│   ├── App.js            # Main app with routing (9 routes)
│   ├── AuthContext.js    # Authentication state management
│   ├── Dashboard.js      # Welcome page with BMI and doctor info
│   ├── Readings.js       # Blood sugar tracking with color coding
│   ├── Medications.js    # Smart medication reminders
│   ├── FoodInsights.js   # Kenyan food database with recommendations
│   ├── SmartAlerts.js    # AI-powered glucose pattern alerts
│   ├── Gamification.js   # Progress tracking, badges, challenges
│   ├── Education.js      # Interactive diabetes education modules
│   └── Profile.js        # User profile with doctor assignment
├── contexts/
│   └── LanguageContext.js # Bilingual support (English/Swahili)
└── utils/
    └── translations.js    # Translation strings for localization
```

### Database Schema

```text
Models & Relationships:
├── User (1:many → Reading, Medication) + (many:1 → Doctor)
├── Doctor (1:many → User)
├── Reading (many:many → Meal via reading_meals association)
├── Medication (many:1 → User)
└── Meal (many:many → Reading via reading_meals)
```

##  Quick Start

### Requirements

- Python 3.8+
- Node.js 14+
- Git

### 1. Clone and Setup Repository

```bash
git clone <your-repo-url>
cd Diabetes-Management-App
```

### 2. Backend Setup

```bash
cd server
pipenv install
pipenv shell
```

### 3. Database Setup

```bash
# Initialize database and migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed with sample data (including Kenyan doctors and foods)
python seed.py
```

### 4. Start Backend Server

```bash
python app.py
```
The API will be available at `http://localhost:5555`

### 5. Frontend Setup

```bash
cd ../client
npm install
```

### 6. Start Frontend Development Server

```bash
npm start
```
The React app will be available at `http://localhost:3000`

##  Testing the Application

### Sample Login Credentials
After running the seed script, you can login with:
- **Email**: `user1@example.com`
- **Password**: `password123`

### Key User Flows to Test
1. **Language Toggle**: Click 🇰🇪 SW / 🇺🇸 EN button in navbar
2. **Blood Sugar Tracking**: Add readings and see color-coded results
3. **Food Insights**: Explore Kenyan foods and their glucose impact
4. **Smart Alerts**: Add multiple readings to trigger pattern analysis
5. **Gamification**: Complete daily challenges and earn badges
6. **Doctor Assignment**: Assign a doctor in Profile page

## Generating Your Database

NOTE: The initial project directory structure does not contain the `instance` or
`migrations` folders. Change into the `server` directory:

```console
cd server
```

Then enter the commands to create the `instance` and `migrations` folders and
the database `app.db` file:

```
flask db init
flask db upgrade head
```

Type `tree -L 2` within the `server` folder to confirm the new directory
structure:

```console
.
├── app.py
├── config.py
├── instance
│   └── app.db
├── migrations
│   ├── README
│   ├── __pycache__
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions
├── models.py
└── seed.py
```

Edit `models.py` and start creating your models. Import your models as needed in
other modules, i.e. `from models import ...`.

Remember to regularly run
`flask db revision --autogenerate -m'<descriptive message>'`, replacing
`<descriptive message>` with an appropriate message, and `flask db upgrade head`
to track your modifications to the database and create checkpoints in case you
ever need to roll those modifications back.

> **Tip: It's always a good idea to start with an empty revision! This allows
> you to roll all the way back while still holding onto your database. You can
> create this empty revision with `flask db revision -m'Create DB'`.**

If you want to seed your database, now would be a great time to write out your
`seed.py` script and run it to generate some test data. Faker has been included
in the Pipfile if you'd like to use that library.

---

#### `config.py`

When developing a large Python application, you might run into a common issue:
_circular imports_. A circular import occurs when two modules import from one
another, such as `app.py` and `models.py`. When you create a circular import and
attempt to run your app, you'll see the following error:

```console
ImportError: cannot import name
```

If you're going to need an object in multiple modules like `app` or `db`,
creating a _third_ module to instantiate these objects can save you a great deal
of circular grief. Here's a good start to a Flask config file (you may need more
if you intend to include features like authentication and passwords):

```py
# Standard library imports

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

```

Now let's review that last line...

#### CORS

CORS (Cross-Origin Resource Sharing) is a system that uses HTTP headers to
determine whether resources from different servers-of-origin can be accessed. If
you're using the fetch API to connect your frontend to your Flask backend, you
need to configure CORS on your Flask application instance. Lucky for us, that
only takes one line:

```py
CORS(app)

```

By default, Flask-CORS enables CORS on all routes in your application with all
fetching servers. You can also specify the resources that allow CORS. The
following specifies that routes beginning with `api/` allow CORS from any
originating server:

```py
CORS(app, resources={r"/api/*": {"origins": "*"}})

```

You can also set this up resource-by-resource by importing and using the
`@cross_origin` decorator:

```py
@app.route("/")
@cross_origin()
def howdy():
  return "Howdy partner!"

```

---


## Authors

- Birundu
- Nicholas
- Mohamed

## License

MIT License

Copyright (c) 2025 Birundu, Nicholas, and Mohamed
