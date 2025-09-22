from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime

from config import db

# Association Table for many-to-many relationship between Sale and Staff
sale_staff = db.Table(
    'sale_staff',
    db.Column('sale_id', db.Integer, db.ForeignKey('sales.id'), primary_key=True),
    db.Column('staff_id', db.Integer, db.ForeignKey('staff.id'), primary_key=True),
    db.Column('role_in_sale', db.String(50), nullable=False),  # Extra attribute
    db.Column('created_at', db.DateTime, server_default=db.func.now()),
    db.Column('updated_at', db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
)

class Station(db.Model, SerializerMixin):
    __tablename__ = 'stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    pumps = db.relationship('Pump', backref='station', lazy=True, cascade='all, delete-orphan')
    staff = db.relationship('Staff', backref='station', lazy=True, cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-pumps.station', '-staff.station')

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 2:
            raise ValueError("Station name must be at least 2 characters long")
        return name.strip()

class Pump(db.Model, SerializerMixin):
    __tablename__ = 'pumps'

    id = db.Column(db.Integer, primary_key=True)
    pump_number = db.Column(db.Integer, nullable=False)
    station_id = db.Column(db.Integer, db.ForeignKey('stations.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    sales = db.relationship('Sale', backref='pump', lazy=True, cascade='all, delete-orphan')

    # Serialization rules
    serialize_rules = ('-station.pumps', '-sales.pump')

    @validates('pump_number')
    def validate_pump_number(self, key, pump_number):
        if not isinstance(pump_number, int) or pump_number <= 0:
            raise ValueError("Pump number must be a positive integer")
        return pump_number

class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50))
    station_id = db.Column(db.Integer, db.ForeignKey('stations.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    sales = db.relationship('Sale', secondary=sale_staff, back_populates='staff')

    # Serialization rules
    serialize_rules = ('-station.staff', '-sales.staff')

    @validates('name')
    def validate_name(self, key, name):
        if not name or len(name.strip()) < 2:
            raise ValueError("Staff name must be at least 2 characters long")
        return name.strip()

class Sale(db.Model, SerializerMixin):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    fuel_type = db.Column(db.String(50), nullable=False)
    litres = db.Column(db.Float, nullable=False)
    price_per_litre = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    pump_id = db.Column(db.Integer, db.ForeignKey('pumps.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    staff = db.relationship('Staff', secondary=sale_staff, back_populates='sales')

    # Serialization rules
    serialize_rules = ('-pump.sales', '-staff.sales')

    @validates('litres', 'price_per_litre')
    def validate_positive_numbers(self, key, value):
        if not isinstance(value, (int, float)) or value <= 0:
            raise ValueError(f"{key} must be a positive number")
        return value

    @validates('fuel_type')
    def validate_fuel_type(self, key, fuel_type):
        valid_fuel_types = ['diesel', 'unleaded', 'premium', 'super']
        if fuel_type.lower() not in valid_fuel_types:
            raise ValueError(f"Invalid fuel type. Must be one of: {', '.join(valid_fuel_types)}")
        return fuel_type.lower()

    def __repr__(self):
        return f'<Sale {self.id}: {self.litres}L of {self.fuel_type} at {self.timestamp}>'
