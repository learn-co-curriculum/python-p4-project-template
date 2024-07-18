from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
import re

from config import db

# Models go here!
class User(db.Model, SerializerMixin):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String, unique=True, nullable=False)
  email = db.Column(db.String, unique=True, nullable=False)
  password = db.Column(db.String, nullable=False)
  
  reviews = db.relationship('Review', back_populates = 'user')
  destinations = association_proxy('reviews', 'destination' )
  
  @validates('email')
  def validate_email(self, key, email):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
      raise ValueError('Invalid email address')
    return email
  
  @validates('password')
  def validate_password(self, key, password):
    if len(password) < 8:
      raise ValueError('Password must be at least 8 characters long')
    return password
  
  @validates('username')
  def validate_username(self, key, username):
    user = User.query.filter_by(username=username).first()
    if user:
      raise ValueError('Username already exists')
    return username
  
class Destination(db.Model, SerializerMixin):
  __tablename__ = 'destinations'
  
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String, nullable=False)
  location = db.Column(db.String, nullable=False)
  description = db.Column(db.String, nullable=False)
  image = db.Column(db.String, nullable=False)
  
  reviews = db.relationship('Review', back_populates = 'destination')
  
  @validates('name')
  def validate_name(self, key, name):
    if len(name) < 5:
      raise ValueError('Name must be at least 5 characters long')
    return name
  
  @validates('location')
  def validate_location(self, key, location):
    if len(location) < 5:
      raise ValueError('Location must be at least 5 characters long')
    return location
  
  @validates('image')
  def validate_image(self, key, image):
    if not re.match(r"^https?://.+", image):
      raise ValueError('Invalid image URL')
    return image
  
  @validates('description')
  def validate_description(self, key, description):
    if len(description) < 10:
      raise ValueError('Description must be at least 10 characters long')
    return description
  
class Review(db.Model, SerializerMixin):
  __tablename__ = 'reviews'
  
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
  rating = db.Column(db.Integer, nullable=False)
  comment = db.Column(db.String, nullable=False)
  
  user = db.relationship('User', back_populates='reviews')
  destination = db.relationship('Destination', back_populates='reviews')
  
  @validates('comment')
  def validate_comment(self, key, comment):
    if len(comment) < 5:
      raise ValueError('Comment must be at least 5 characters long')
    return comment
  
  @validates(rating)
  def validate_rating(self, key, rating):
    if 5 < rating < 0:
      raise ValueError('Rating must be between 1 and 5')
    return rating