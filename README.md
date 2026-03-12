# LetsStudy! — A Platform for Collaborative Learning

Team: Group 4 — Ajok Yai · Benson Mwangi · Samuel Emanman · Sandra Manyarkiy

## Short description

LetsStudy! is a full‑stack web application that helps students and lecturers in
Kenya create, join, and manage structured study groups. The platform pairs
role‑based access (student / lecturer) with membership tiers, course‑linked
groups, gated content, and reviews — helping learners find committed,
high‑quality study communities.

## Key project links

- Repository: [sjmanyarkiy/group-4-study-group-finder](https://github.com/sjmanyarkiy/group-4-study-group-finder)

## Table of contents

- Problem statement
- Solution overview
- MVP features
- Technical stack
- Data models & relationships
- Installation & local setup
- API basics (endpoints & examples)
- Contributing
- License

## 1. Problem statement

Many students struggle to find structured, community‑driven study environments
outside the classroom. Lecturers lack a simple way to create and manage study
groups, share materials, and track membership. This fragmentation reduces
knowledge sharing and negatively impacts academic outcomes.

## 2. Our solution

LetsStudy! centralizes discovery and management of study groups. The
application supports:

- Role‑based access (student, lecturer)
- Study groups tied to courses and institutions
- Membership with tiered fees (Standard, Premium) and gated content
- Review system (star rating) to surface high‑quality groups
- A React frontend with validated forms and a RESTful Flask backend

## 3. Minimum Viable Product (MVP)

The MVP implements the core flows needed for an initial launch:

- Authentication & role assignment (student / lecturer)
- Lecturers create and manage study groups
- Students join groups via membership payments (Standard: 500 KSh, Premium: 1000 KSh)
- Institutions and courses management
- Star reviews and basic search/filtering by course or institution
- Access control so only group members can see gated content

## 4. Technical stack

### Backend

- Python 3.x, Flask — REST API
- Flask-RESTful — resource-based routing
- Flask-Migrate — migrations
- Flask-CORS — cross‑origin access for the React client
- SQLAlchemy + Flask-SQLAlchemy — ORM
- SQLite — development DB (for local/dev)
- Werkzeug — secure password hashing

### Frontend

- React (v18)
- React Router v5
- Formik + Yup — forms & validation
- Fetch API — client/server comms

## 5. Models & relationships

Primary models (conceptual):

- User — user_ID (PK), name, dob, email, national_ID, phone, user_category (student/lecturer)
- Institution — institution_ID (PK), institution_name
- Course — course_ID (PK), course_name
- StudyGroup — study_group_ID (PK), name, course_ID (FK), start_date, end_date, owner_user_id (FK)
- Membership — membership_ID (PK), user_id (FK), study_group_id (FK), tier (Standard/Premium), fee, date_joined, date_graduated
- Review — review_ID (PK), user_id (FK), study_group_id (FK), stars (1–5), comment, created_at

Relationships:

- One lecturer (User) can create many StudyGroups (one-to-many).
- StudyGroup has many Memberships (one-to-many).
- StudyGroups ↔ Institution can be modeled as many-to-many (a group may be associated with multiple institutions).
- Course → StudyGroup is one-to-many (a course can have multiple study groups).

## 6. Installation & local setup

### Prerequisites

- macOS (tested), Python 3.10+, Node.js 16+ and npm
- pipenv (recommended) for the backend, or use a virtualenv

### Clone the repository

```bash
git clone https://github.com/sjmanyarkiy/group-4-study-group-finder.git
cd group-4-study-group-finder
git checkout -b <your-branch-name>
```

### Backend (server)

1. Install dependencies and activate pipenv shell:

```bash
pipenv install
pipenv shell
```

1. Create environment variables

Create a `.env` file in the `server/` directory with at least the following
values (placeholders shown):

```env
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/app.db
SECRET_KEY=replace-with-a-secure-random-string
```

1. Initialize the database & migrations (first-time setup)

```bash
cd server
flask db init       # only once
flask db migrate -m "Initial migration"
flask db upgrade
```

1. Seed the database (optional):

```bash
python seed.py
```

1. Run the Flask server:

```bash
python app.py
# or, if using the flask CLI from within the server directory
flask run --port=5555
```

### Frontend (client)

1. Install dependencies and start the development server:

```bash
npm install --prefix client
npm start --prefix client
```

1. The React app proxies API requests to the Flask server (default proxy:
  [http://localhost:5555](http://localhost:5555)). Visit [http://localhost:3000](http://localhost:3000) to open the UI.

## 7. API basics (examples)

This project follows a RESTful structure. Below are common endpoints. Replace
{id} and payloads with actual values.

### Authentication

- POST /auth/register — register new user (payload includes role)
- POST /auth/login — login; returns a session cookie or token

### Study groups

- GET /study-groups — list groups (query by course/institution)
- POST /study-groups — create (lecturer only)
- GET `/study-groups/{id}` — group details
- PATCH `/study-groups/{id}` — update (owner/lecturer)
- DELETE `/study-groups/{id}` — remove (owner/lecturer)

### Memberships

- POST `/study-groups/{id}/join` — create membership (student)
- GET `/study-groups/{id}/members` — list members (lecturers & members)

### Reviews

- POST `/study-groups/{id}/reviews` — create a review (member only)
- GET `/study-groups/{id}/reviews` — list reviews

## 8. Development notes

- Use Formik + Yup on the frontend to validate inputs (registration, group
  creation, payments) before sending to the API.
- Protect backend routes with decorators or middleware that check the user's
  role and membership status before serving gated content.
- Keep secrets out of the repository. Use `.env` for local development.

## 9. Seeding & test data

`server/seed.py` creates example users, institutions, courses, groups, and
memberships so you can test the flows quickly. Seeded data is useful for
manual QA and UI testing.

## 10. Contributing

We welcome contributions. A good workflow for this repo is:

1. Fork the repo and clone your fork.
1. Create a feature branch named after your task, e.g. `ajok/institutions-crud`.
1. Commit frequently with clear messages and open a pull request to `main` when
   your feature is ready for review.

## Team & Branch Ownership (recommended)

- Sandra — User model, authentication routes, integration lead
- Ajok — StudyGroup model, Institution model, CRUD routes
- Benson — Membership model, joining flow, access control
- Samuel — Course model, Review model, admin/lecturer content

Please follow the existing repository style and run the application locally
before opening a PR.

## 11. License

This project is released under the MIT License. See `LICENSE.md` for details.

## 12. Contact & support

If you have questions or want to work with the team, open an issue in the
repository or contact the project owners via the GitHub repo.

## Acknowledgements

This README was written specifically for the LetsStudy! (Group 4) project and
summarizes the project goals, architecture, and developer onboarding steps.

Happy building! 🚀
