#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Pet, Adoption, Favorite

if __name__ == "__main__":
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
        Favorite.query.delete()
        # db.create_all()

        print("Creating pets...")
        pet1 = Pet(name="Bang Kitty", breed="American Shorthair", type="Cat", image=" ")
        pet2 = Pet(
            name="Stuart",
            breed="Annoyoying",
            type="Rat",
            image="https://pbs.twimg.com/media/FPgA0D7XEAAtzr4.jpg",
        )
        pet3 = Pet(
            name="Lil King Trashmouth",
            breed="North American Raccoon",
            type="Raccoon",
            image="https://sdzwildlifeexplorers.org/sites/default/files/2020-10/racoon-02.jpg",
        )
        pet4 = Pet(
            name="DOOfus",
            breed="Wiener",
            type="Dog",
            image="https://i.kym-cdn.com/photos/images/masonry/002/304/541/b96.gif",
        )
        pets = [pet1, pet2, pet3, pet4]

        print("Creating users...")

        user1 = User(name="Emma", username="Firstwright", password="123badpass")
        user2 = User(name="Geri", username="Holloway", password="51^$23618*)")
        user3 = User(name="Nial Johnson", username="Nilo", password="mtpass1")
        users = [user1, user2, user3]
        db.session.add_all(pets)
        db.session.add_all(users)
        db.session.commit()
        print("Creating adoptions")

        adopt1 = Adoption(user_id=1, pet_id=1)
        adopt2 = Adoption(user_id=2, pet_id=2)
        adopt3 = Adoption(user_id=3, pet_id=3)
        fav1 = Favorite(user_id=1, pet_id=1)
        fav2 = Favorite(user_id=2, pet_id=2)
        fav3 = Favorite(user_id=3, pet_id=3)
        adoptions = [adopt1, adopt2, adopt3]
        favorites = [fav1, fav2, fav3]
        db.session.add_all(adoptions)
        db.session.add_all(favorites)
        db.session.commit()

        print("Seeding done!")  # Empty tables
