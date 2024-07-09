from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship, backref
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    max_budget = Column(Numeric, nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    packages = relationship('Package', backref='user')
    passengers = relationship('Passenger', backref='user')
    ships = association_proxy('user_ship_associations', 'ship')

class Package(db.Model, SerializerMixin):
    __tablename__ = 'packages'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    weight = Column(Numeric, nullable=False)
    cost = Column(Numeric, nullable=False)
    destination = Column(String, nullable=False)
    status = Column(String, nullable=False)
    ship_id = Column(Integer, ForeignKey('ships.id'), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

class Passenger(db.Model, SerializerMixin):
    __tablename__ = 'passengers'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ticket_number = Column(String, nullable=False)
    cost = Column(Numeric, nullable=False)
    destination = Column(String, nullable=False)
    ship_id = Column(Integer, ForeignKey('ships.id'), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

class Ship(db.Model, SerializerMixin):
    __tablename__ = 'ships'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    capacity_weight = Column(Numeric, nullable=False)
    current_weight = Column(Numeric, nullable=False)
    total_tickets = Column(Integer, nullable=False)
    available_tickets = Column(Integer, nullable=False)
    port_id = Column(Integer, ForeignKey('ports.id'), nullable=False)
    contractor_id = Column(Integer, ForeignKey('contractors.id'), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    packages = relationship('Package', backref='ship')
    passengers = relationship('Passenger', backref='ship')
    user_ship_associations = relationship('UserShipAssociation', backref='ship')

class Port(db.Model, SerializerMixin):
    __tablename__ = 'ports'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    ships = relationship('Ship', backref='port')

class Contractor(db.Model, SerializerMixin):
    __tablename__ = 'contractors'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    contact_info = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())

    ships = relationship('Ship', backref='contractor')

class UserShipAssociation(db.Model, SerializerMixin):
    __tablename__ = 'user_ship_associations'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    ship_id = Column(Integer, ForeignKey('ships.id'), nullable=False)
    created_at = Column(DateTime, server_default=db.func.now())
