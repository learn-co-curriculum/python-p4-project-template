from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from sqlalchemy.orm import validates

# Models go here!


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_rules = ('-orders', '-farmers')
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    address = db.Column(db.String)
    payment_method = db.Column(db.Integer)

    orders = db.relationship('Order', backref = 'customer', cascade= 'all, delete-orphan')
    farmers = association_proxy('orders', 'farmer')

    @validates('payment_method')
    def validates_pay(self, key, payment_method):
        payment_method_str = str(payment_method)
        if len(payment_method_str) != 16:
            raise ValueError('Card number must be 16 digits')
        return payment_method
    

class Farmer(db.Model, SerializerMixin):
    __tablename__ = 'farmers'
    serialize_rules = ('-orders', '-customers')
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique=True, nullable=False)
    location = db.Column(db.String)

    orders = db.relationship('Order', backref = 'farmer')
    customers = association_proxy('orders', 'customer')

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    serialize_rules = ('-farmers', '-customers')
    id = db.Column(db.Integer, primary_key = True)
    details = db.Column(db.Text)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'))
    created_at = db.Column(db.DateTime, server_default = db.func.now())
    updated_at = db.Column(db.DateTime, onupdate = db.func.now())