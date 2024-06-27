
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy 
from sqlalchemy.orm import validates

from config import db

# Models go here!

class User(db.Model, SerializerMixin): 
    
    __tablename__ = 'users' 

    id = db.Column(db.Integer, primary_key = True) 
    first_name = db.Column(db.String, unique = True, nullable = False) 
    last_name = db.Column(db.String, unique = True, nullable = False)
    username = db.Column(db.String, unique = True, nullable = False) 
    _password_hash = db.Column(db.String, nullable = False) 
    email = db.Column(db.String, nullable = False) 

    user_recipes = db.relationship("UserRecipe", back_populates = "user")
    recipes = association_proxy("user_recipes", "recipe") 

    serialize_rules = ('-user_recipes', '-recipes') 

    def __repr__(self): 
        return f"<User {self.username}>" 

class Recipe(db.Model, SerializerMixin): 
   
    __tablename__ = 'recipes' 

    id = db.Column(db.Integer, primary_key = True) 
    title = db.Column(db.String, nullable = False) 
    description = db.Column(db.String, nullable = False) 
    instructions = db.Column(db.String, nullable = False) 
    image_url = db.Column(db.String) 
    tag = db.Column(db.String) 

    user_recipes = db.relationship("UserRecipe", back_populates = "recipe")
    user = association_proxy("user_recipes", "user") 

    serialize_rules = ('-user_recipes', '-user') 

    def __repr__(self): 
        return f"<Recipe {self.title}>" 


class UserRecipe(db.Model,SerializerMixin): 

    __tablename__='UserRecipe'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))


    user = db.relationship("User", back_populates = "user_recipes")
    recipe = db.relationship("Recipe", back_populates = "user_recipes") 





    
