from sqlalchemy_serializer import SerializerMixin

from config import db

# Models go here!

class Customer(db.model, SerializerMixin):
    __tablename__ = 'customers'
    id = db.Column (db.Integer, primary_key = True)
    orders = db.relationship('Order', backref = 'customer')
    farmers = association_proxy('orders', 'farmer')

class Farmer(db.model, SerializerMixin):
    __tablename__ = 'farmers'
    id = db.Column (db.Integer, primary_key = True)
    orders = db.relationship('Order', backref = 'farmer')
    customers = association_proxy('orders', 'customer')

class Order(db.model, SerializerMixin):
    __tablename__ = 'orders'
    id = db.Column (db.Integer, primary_key = True)
    customer_id = db.Column (db.Integer, db.ForeignKey('customers.id'))
    farmer_id = db.Column (db.Integer, db.ForeignKey('farmers.id'))