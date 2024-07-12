
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import re

metadata = MetaData()

db = SQLAlchemy(metadata=metadata)


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(10), nullable=False, default='user')
    
    @validates('email')
    def validate_email(self, key, email):
        regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.match(regex, email):
            raise ValueError("Invalid email address")
        return email
    
    orders = db.relationship('Order', back_populates='user')
    
    def __repr__(self):
        return f"<User {self.id}: {self.username}>"

class MenuItem(db.Model, SerializerMixin):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(200))
    
    def __repr__(self):
        return f"<MenuItem {self.id}: {self.name}, {self.description}, {self.price}, {self.image}>"

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', back_populates='orders')
    menu_item = db.relationship('MenuItem')
    
    def __repr__(self):
        return f"<Order {self.id}: {self.user_id}, {self.menu_item_id}, {self.quantity}, {self.order_date}>"