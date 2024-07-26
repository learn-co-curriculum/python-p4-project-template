from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    sku = db.Column(db.String)
    description = db.Column(db.String)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Integer)
    supplier = db.Column(db.String)

    transactions = relationship('Transaction', back_populates='product')

    serialize_rules = ('-transactions',)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sku': self.sku,
            'description': self.description,
            'quantity': self.quantity,
            'price': self.price,
            'supplier': self.supplier
        }

    def __repr__(self):
        return f'<Product {self.id}, {self.name}, {self.sku}, {self.description}, {self.quantity}, {self.price}, {self.supplier}>'

class Transaction(db.Model, SerializerMixin):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    product_id = db.Column(db.Integer, ForeignKey('products.id'))
    date = db.Column(DateTime, default=datetime.utcnow)
    quantity = db.Column(db.Integer)
    total_price = db.Column(Numeric(10, 2))

    # user = relationship('User', back_populates='transactions')
    product = relationship('Product', back_populates='transactions')

    def __repr__(self):
        return f'<Transaction {self.id}, {self.user_id}, {self.product_id}, {self.date}, {self.quantity}, {self.total_price}>'


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    companyName = db.Column(db.String, nullable=True)
    country = db.Column(db.String, nullable=True)
    city = db.Column(db.String, nullable=True)

    def set_password(self, plain_password):
        self.password = bcrypt.generate_password_hash(plain_password).decode('utf-8')

    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password, plain_password)

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    @classmethod
    def find_by_email_and_password(cls, email, password):
        user = cls.query.filter_by(email=email).first()
        if user and user.check_password(password):
            return user
        return None

    def __repr__(self):
        return f'<User {self.id}, {self.email}, {self.companyName}, {self.country}, {self.city}>'
