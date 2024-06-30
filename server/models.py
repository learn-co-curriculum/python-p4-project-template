
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy 
from sqlalchemy.orm import validates

from config import db, bcrypt

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
    
    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('Username cannot be empty')
        elif len(username) > 20:
            raise ValueError('Username cannot be longer than 20 characters')
        elif User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        return username 

    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError('Email cannot be empty')
        elif '@' not in email:
            raise ValueError('Invalid email, must contain an @')
        return email 

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

    @validates('title') 
    def validate_title(self, key, title): 
        if not title: 
            raise ValueError('Title cannot be empty') 
        elif len(title) > 50: 
            raise ValueError('Title cannot be longer than 50 characters') 
        return title 

    @validates('instructions') 
    def validate_instructions(self, key, instructions): 
        if not instructions: 
            raise ValueError('Instructions cannot be empty') 
        elif len(instructions) > 500: 
            raise ValueError('Instructions cannot be longer than 500 characters') 
        return instructions

    @validates('tag') 
    def validate_tag(self, key, tag): 
        tags = ['breakfast','lunch','dinner'] 
        if tag not in tags: 
            raise ValueError('Invalid tag, must be breakfast, lunch, or dinner') 
        return tag 

    def __repr__(self): 
        return f"<Recipe {self.title}>" 


class UserRecipe(db.Model,SerializerMixin): 

    __tablename__='UserRecipe'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'))


    user = db.relationship("User", back_populates = "user_recipes")
    recipe = db.relationship("Recipe", back_populates = "user_recipes") 





    
