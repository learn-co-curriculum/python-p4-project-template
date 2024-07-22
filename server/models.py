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
    
    orders = db.relationship('Order', back_populates='user')
    
    @validates('email')
    def validate_email(self, key, email):
        regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.match(regex, email):
            raise ValueError("Invalid email address")
        return email
    
    def to_dict(self, include_orders=False):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
        }
        if include_orders:
            data['orders'] = [order.to_dict(include_user=False) for order in self.orders]
        return data

class MenuItem(db.Model, SerializerMixin):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(200))
    
    order_items = db.relationship('OrderItem', back_populates='menu_item')
    
    def to_dict(self, include_order_items=False):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
        }
        if include_order_items:
            data['order_items'] = [order_item.to_dict(include_menu_item=False) for order_item in self.order_items]
        return data

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), nullable=False)
    
    user = db.relationship('User', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order')
    
    def to_dict(self, include_user=True, include_order_items=False):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'order_date': self.order_date,
            'status': self.status,
        }
        if include_user:
            data['user'] = self.user.to_dict(include_orders=False)
        if include_order_items:
            data['order_items'] = [order_item.to_dict(include_order=False) for order_item in self.order_items]
        return data

class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    menuitem_name = db.Column(db.String, nullable=False)
    menuitem_price = db.Column(db.Float, nullable=False)
    menu_item_image = db.Column(db.String(200))
    quantity = db.Column(db.Integer, nullable=False)
    # user_id = db.Column(db.Integer, nullable=False)  # Assuming session_id field

    order = db.relationship('Order', back_populates='order_items')
    menu_item = db.relationship('MenuItem', back_populates='order_items')
    
    def to_dict(self, include_order=True, include_menu_item=True):
        data = {
            'id': self.id,
            'order_id': self.order_id,
            'menu_item_id': self.menu_item_id,
            'menuitem_name': self.menuitem_name,
            'menuitem_price': self.menuitem_price,
            'menu_item_image': self.menu_item_image,
            'quantity': self.quantity,
            'session_id': self.session_id
        }
        if include_order:
            data['order'] = self.order.to_dict(include_user=False, include_order_items=False)
        if include_menu_item:
            data['menu_item'] = self.menu_item.to_dict(include_order_items=False)
        return data
