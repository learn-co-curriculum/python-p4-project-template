#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta, date, time
import random

# Local imports
from config import app, db
from models import User, Reading, Medication, Meal, Doctor, reading_meals


def reset_database():
    """Delete existing rows in an order that respects FKs."""
    # Delete associations first
    db.session.execute(reading_meals.delete())
    # Then child tables
    db.session.execute(db.delete(Reading))
    db.session.execute(db.delete(Medication))
    db.session.execute(db.delete(Meal))
    # Then parent
    db.session.execute(db.delete(User))
    db.session.execute(db.delete(Doctor))
    db.session.commit()


def seed_doctors(fake: Faker, n=3):
    docs = []
    for i in range(n):
        d = Doctor(
            name=f"Dr. {fake.last_name()}",
            email=f"doctor{i+1}@example.com",
        )
        docs.append(d)
        db.session.add(d)
    db.session.commit()
    return docs


def seed_users(fake: Faker, doctors=None, n=3):
    users = []
    for i in range(n):
        u = User(
            name=fake.name(),
            email=f"user{i+1}@example.com",
            diabetes_type=random.choice([None, 'type1', 'type2', 'gestational', 'prediabetes'])
        )
        # Use the hybrid setter
        u.password_hash = 'password123'  # same password for all seed users
        # Optional BMI fields
        if random.choice([True, False]):
            u.height_cm = random.uniform(150, 190)
            u.weight_kg = random.uniform(55, 110)
        # Optionally assign a doctor (one doctor per user)
        if doctors and random.choice([True, False]):
            u.doctor_id = random.choice(doctors).id
        users.append(u)
        db.session.add(u)
    db.session.commit()
    return users


def seed_meals(fake: Faker, n=6):
    names = ['Grilled Chicken Salad', 'Oatmeal & Berries', 'Veggie Omelette', 'Quinoa Bowl', 'Yogurt Parfait', 'Stir-fry Veggies']
    meals = []
    for i in range(n):
        m = Meal(
            name=random.choice(names),
            meal_type=random.choice(['breakfast', 'lunch', 'dinner', 'snack']),
            description=fake.sentence(nb_words=8)
        )
        meals.append(m)
        db.session.add(m)
    db.session.commit()
    return meals


def seed_readings_for_user(user: User, days=3):
    readings = []
    today = date.today()
    for d in range(days):
        the_date = today - timedelta(days=d)
        # Pre-meal and post-meal per day
        pre_val = random.uniform(75, 160)
        post_val = random.uniform(110, 220)
        r1 = Reading(
            value=round(pre_val, 1),
            date=the_date,
            time=time(hour=8, minute=random.randint(0, 59)),
            context='pre_meal',
            notes=random.choice([None, 'Felt fine', 'Light workout earlier']),
            user_id=user.id,
        )
        r2 = Reading(
            value=round(post_val, 1),
            date=the_date,
            time=time(hour=13, minute=random.randint(0, 59)),
            context='post_meal',
            notes=random.choice([None, 'Tired after lunch', 'New recipe tried']),
            user_id=user.id,
        )
        db.session.add_all([r1, r2])
        readings.extend([r1, r2])
    db.session.commit()
    return readings


def seed_medications_for_user(user: User, n=3):
    meds = []
    for _ in range(n):
        m = Medication(
            name=random.choice(['Metformin', 'Insulin', 'GLP-1', 'SGLT2 Inhibitor']),
            dose=random.choice(['500mg', '10 units', '5mg', '15mg']),
            time=time(hour=random.choice([7, 12, 20]), minute=0),
            status=random.choice(['pending', 'taken', 'missed']),
            user_id=user.id,
        )
        meds.append(m)
        db.session.add(m)
    db.session.commit()
    return meds


def link_meals_to_readings(readings, meals):
    # Link a random meal to some readings with carbs_amount
    for r in readings:
        if random.choice([True, False]):
            meal = random.choice(meals)
            carbs = random.choice([None, 25.0, 45.0, 60.0])
            ins = reading_meals.insert().values(
                reading_id=r.id,
                meal_id=meal.id,
                carbs_amount=carbs,
            )
            db.session.execute(ins)
    db.session.commit()


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Seeding database...")
        reset_database()
        doctors = seed_doctors(fake, n=3)
        meals = seed_meals(fake)
        users = seed_users(fake, doctors=doctors, n=3)
        for u in users:
            readings = seed_readings_for_user(u, days=3)
            seed_medications_for_user(u, n=3)
            link_meals_to_readings(readings, meals)
        print("Done.")
