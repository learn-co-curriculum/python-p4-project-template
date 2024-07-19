from datetime import datetime
from flask_bcrypt import Bcrypt, check_password_hash
from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from config import db

bcrypt = Bcrypt()

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    date = db.Column(DateTime, default=datetime.utcnow)

    products = relationship('Product', back_populates='supplier')

    def __repr__(self):
        return f'<Supplier {self.id}, {self.name}, {self.description}, {self.date}>'

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(Numeric(10, 2))
    supplier_id = db.Column(db.Integer, ForeignKey('suppliers.id'))
    date = db.Column(DateTime, default=datetime.utcnow)

    supplier = relationship('Supplier', back_populates='products')
    transactions = relationship('Transaction', back_populates='product')
    orders = relationship('Order', back_populates='product')

    def __repr__(self):
        return f'<Product {self.id}, {self.name}, {self.description}, {self.price}, {self.supplier_id}, {self.date}>'

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    date = db.Column(DateTime, default=datetime.utcnow)
    quantity = db.Column(db.Integer)
    total_price = db.Column(Numeric(10, 2))

    product = relationship('Product', 'User', back_populates='transactions')

    def __repr__(self):
        return f'<Transaction {self.id}, {self.user_id}, {self.product_id},{self.date},{self.quantity},{self.total_price}>'

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    quantity = db.Column(db.Integer)
    price = db.Column(Numeric(10, 2))
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    date_received = db.Column(DateTime, default=datetime.utcnow)

    product = relationship('Product', back_populates="orders")

    def __repr__(self):
        return f'<Order {self.description}, Quantity: {self.quantity}, received on {self.date_received}>'

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    role = db.Column(db.Text)
    password = db.Column(db.String)

    serialize_rules = ('-password',)

    def set_password(self, plain_password):
        self.password = bcrypt.generate_password_hash(plain_password).decode('utf-8')

    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password, plain_password)