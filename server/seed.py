#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Recipe, UserRecipe

if __name__ == '__main__':
    fake = Faker()
    with app.app_context(): 
        print ("Deleting data...") 
        User.query.delete() 
        Recipe.query.delete() 
        UserRecipe.query.delete()
        
        print("Starting seed...")
        

        print("Creating user") 
        user1 = User(username="jojo", first_name="Joel", last_name="John", 
                email="jojo@gmail.com", _password_hash="2992") 
        user2 = User(username="tjay", first_name="Tyler", last_name="Jay", 
                email="tjay@gmail.com", _password_hash="1234") 
        db.session.add_all([user1,user2]) 
        db.session.commit() 

        print("Creating recipes") 
        recipe1= Recipe(title="bacon,egg and cheese", description="on a roll there are juicy bacon, fluffy eggs and melted cheese", 
                        instructions="make bacon, make eggs, melt the cheese, toast the roll", 
                        image_url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2f2Pk7Jwq-BsKmVNIUsLz70iC4i0YFMmk5g&s", 
                        tag="breakfast") 
        db.session.add_all([recipe1]) 
        db.session.commit() 

        print("Creating user_recipes...") 
        user_recipes1 = UserRecipe(user_id = 2, recipe_id= 1) 
        db.session.add_all([user_recipes1]) 
        db.session.commit()
        
