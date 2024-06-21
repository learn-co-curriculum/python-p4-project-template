from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    properties = db.relationship('Property', backref='owner', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)
    visits = db.relationship('Visit', backref='visitor', lazy=True)
    favorite_properties = db.relationship('FavoriteProperty', backref='favorite_properties', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class Property(db.Model, SerializerMixin):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255))
    price = db.Column(db.Float, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    visits = db.relationship('Visit', backref='visits_property', lazy=True)
    reviews = db.relationship('Review', backref='reviews_property', lazy=True)
    favorites = db.relationship('FavoriteProperty', backref='favorites_property', lazy=True)

    def __repr__(self):
        return f'<Property {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'image': self.image,
            'description': self.description,
            'price': self.price,
            'address': self.address,
            'owner_id': self.owner_id
        }

class Visit(db.Model, SerializerMixin):
    __tablename__ = 'visits'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    
    def __repr__(self):
        return f'<Visit {self.id} by User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'scheduled_date': self.scheduled_date,
            'status': self.status
        }

class FavoriteProperty(db.Model, SerializerMixin):
    __tablename__ = 'favorite_properties'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    added_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    user = db.relationship('User', backref='users_favorite_properties')
    property = db.relationship('Property', backref='favorited_property')

    def __repr__(self):
        return f'<FavoriteProperty {self.id} by User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'added_at': self.added_at
        }

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Review {self.id} by User {self.user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'rating': self.rating,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'created_at': self.created_at
        }