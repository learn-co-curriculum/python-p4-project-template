#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Food

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        Food.query.delete()
        foods = [
            Food(name="Ugali", carbs=40, gi=56, serving_grams=200),
            Food(name="Sukuma Wiki", carbs=7, gi=15, serving_grams=100),
            Food(name="Githeri", carbs=30, gi=45, serving_grams=250),
            Food(name="Chapati", carbs=50, gi=62, serving_grams=120),
            Food(name="Nyama Choma", carbs=0, gi=0, serving_grams=150),
        ]
        db.session.add_all(foods)
        db.session.commit()
        print(f"Seeded {len(foods)} foods.")
