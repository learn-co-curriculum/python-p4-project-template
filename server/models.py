from datetime import datetime
from flask_bcrypt import Bcrypt, check_password_hash
from sqlalchemy import DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from config import db

bcrypt = Bcrypt()

class Product(db.Model, SerializerMixin):
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

    serialize_rules = ('-transactions', '-orders', '-supplier')

    def __repr__(self):
        return f'<Product {self.id}, {self.name}, {self.description}, {self.price}, {self.supplier_id}, {self.date}>'

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer)
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    date = db.Column(DateTime, default=datetime.utcnow)

    product = relationship('Product', back_populates='transactions')

    serialize_rules = ('-product',)

    def __repr__(self):
        return f'<Transaction {self.id}, {self.quantity}, {self.product_id}, {self.date}>'

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
