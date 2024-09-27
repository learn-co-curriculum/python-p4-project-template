#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Pet, Adoption

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

            # This will delete any existing rows
        # so you can run the seed file multiple times without having duplicate entries in your database
        print("Deleting data...")
        Pet.query.delete()
        User.query.delete()
        Adoption.query.delete()
        db.create_all()

        print("Creating pets...")
        pet1 = Pet(name="Fido", breed='pet1', type='pet1')
        pet2 = Pet(name="Abby", breed= 'pet2',type='pet2')
        pet3 = Pet(name="Lil King Trashmouth", breed='pet3', type='pet3')
        pets = [pet1, pet2, pet3]

        print("Creating users...")

        user1 = User(fname="Emma", lname="Firstwright")
        user2 = User(
            fname="Geri", lname="Holloway")
        user3 = User(
            fname="Melanie", lname="Robles")
        users = [user1, user2, user3]
        db.session.add_all(pets)
        db.session.add_all(users)
        db.session.commit()
        print("Creating adoptions")

        adopt1 = Adoption(user_id=1, pet_id=1)
        adopt2 = Adoption(user_id=2, pet_id=2)
        adopt3 = Adoption(user_id=3, pet_id=3)
        adoptions = [adopt1, adopt2, adopt3]
        db.session.add_all(adoptions)
        db.session.commit()

        print("Seeding done!")# Empty tables