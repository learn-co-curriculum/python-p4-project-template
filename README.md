# Welcome to Fitness Fanatics!

## About the Project

- Fitness Fanatics is a web application designed to help users manage their fitness routines with ease. Users can select from a list of predefined exercises, customize them to their needs, and add them to specific routines for different days. The app enables users to track their progress, view all exercises, and filter them by routine or other criteria.
- Whether you’re a beginner or an experienced fitness enthusiast, this app provides an easy-to-use platform for planning, organizing, and optimizing your workouts.

---

## Features
	- Exercise Selection: Browse through a list of predefined exercises, grouped by muscle groups and difficulty levels.
	- Create custom routines for specific days of the week.
	- Add, edit, or remove exercises from routines.
	- Modify exercise attributes such as weight, reps, and difficulty.
	- View all exercises in one place and filter by routine.
	- Secure signup and login functionality.
	- Personalized exercise data for each user.

## Setup

1. Clone the repository:
git clone <repository-url>
cd <repository-folder>

2. Install Python
pipenv install
pipenv shell

3. Set up the database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

4. Set up the front end
navigate to the client directory:
cd client

5. Install Node.js and run
npm install
npm run dev


## Walkthrough
![Fitness Fanatics Walkthrough 1](<client/src/assets/Fitfanatics video1.gif>)

![Fitness Fanatics Walkthrough 2](<client/src/assets/Fitfanatics video2.gif>)

![Fitness Fanatics Walkthrough 3](<client/src/assets/Fitfanatics video3.gif>)