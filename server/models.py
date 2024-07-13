from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_cors import CORS

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    gender = db.Column(db.String)
    password = db.Column(db.String)
    orders = db.relationship('Order', backref='customer', lazy=True)

    def __repr__(self):
        return f'<User {self.id}, {self.name}, {self.email}, {self.gender}, {self.password}>'

class Product(db.Model, SerializerMixin):
    __tablename__ = 'product'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(150), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    orders = db.relationship('OrderItem', backref='product', lazy=True)

    def __repr__(self):
        return f'<Product {self.id}, {self.name}, {self.price}, {self.image}, {self.type}>'

class Order(db.Model, SerializerMixin):
    __tablename__ = 'order'
    id = db.Column(db.Integer, primary_key=True)
    date_ordered = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def __repr__(self):
        return f'<Order {self.id}, {self.date_ordered}, {self.customer_id}>'

class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_item'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<OrderItem {self.id}, {self.order_id}, {self.product_id}, {self.quantity}>'
