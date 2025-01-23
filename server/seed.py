#!/usr/bin/env python3

from random import randint, choice as rc

from faker import Faker

from app import app
from models import db, User, Exercise, RoutineItem

fake = Faker()

workout_exercises = [
    "Barbell Bench Press",
    "Barbell Deadlift",
    "Burpees",
    "Chest Dips",
    "Deadlift",
    "Dumbbell Bench Press",
    "Dumbbell Lunges",
    "Dumbbell Rows",
    "Face Pulls",
    "Incline Bench Press",
    "Incline Dumbbell Curls",
    "Kettlebell Swings",
    "Lateral Raises",
    "Leg Press",
    "Mountain Climbers",
    "Overhead Press",
    "Pull-ups",
    "Push-ups",
    "Seated Cable Rows",
    "Squats",
    "Tricep Dips",
    "Upright Row"
]

muscle_groups = [
    "Glutes",
    "Back",
    "Chest",
    "Shoulders",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Triceps",
    "Biceps",
    "Abs",
    "Forearms"
]

if __name__ == '__main__':
    with app.app_context():

        print("Deleting all records...")
        RoutineItem.query.delete()
        Exercise.query.delete()
        User.query.delete()

        fake = Faker()

        print("Creating users...")

        # make sure users have unique usernames
        users = []
        usernames = []

        for i in range(20):
            
            username = fake.first_name()
            while username in usernames:
                username = fake.first_name()
            usernames.append(username)

            user = User(
                name=username,
                email=fake.email(),
            )

            user.password = 'aaa'

            users.append(user)

        db.session.add_all(users)

        print("Creating exercises...")
        exercises = []
        for i in range(20):
            exercise = Exercise(
                 name=rc(workout_exercises), 
                 muscle_group=rc(muscle_groups),
                 difficulty_level=randint(0,9),
                 image_url="1"
            )
            exercises.append(exercise)

        db.session.add_all(exercises)



        print("Creating routines...")
        routines = []
        for i in range(20):
            routine = RoutineItem(
                initial_weight=randint(15,90),
                current_weight=randint(15,90),
                initial_reps=randint(15,90),
                current_reps=randint(15,90),
                initial_sets=randint(15,90),
                current_sets=randint(15,90),
                priority=randint(0,10),
                day_of_the_week=randint(1,8),
            )
            routine.user = rc(users)
            routine.exercise = rc(exercises)

            routines.append(routine)

        db.session.add_all(routines)
        

        db.session.commit()
        print("Complete.")