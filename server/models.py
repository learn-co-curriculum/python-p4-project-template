from sqlalchemy_serializer import SerializerMixin 
# from sqlalchemy.ext.associationproxy import association_proxy (if you're using it)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from config import db

class Owner(db.Model):
    __tablename__ = 'owners'

    owner_id = db.Column(db.Integer, primary_key=True)
    owner_name = db.Column(db.String, nullable=False)
    contact_info = db.Column(db.String, nullable=False) 
    age = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String, nullable=False)

    # Relationship with Vehicle (one-to-many)
    vehicles = db.relationship("Vehicle", backref='owners') 

    def __repr__(self):
        return f"Owner(id={self.owner_id}, name='{self.owner_name}', age={self.age})"


class Feature(db.Model):
    __tablename__ = 'features'

    feature_id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    speed_km = db.Column(db.String, nullable=False)
    car_cc = db.Column(db.Integer, nullable=True)
    fuel_type = db.Column(db.String, nullable=False)
    
    # Relationship with Vehicle (many-to-many)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.vehicle_id'))
    vehicles = db.relationship("Vehicle", secondary="vehicle_features", back_populates="features")

    def __repr__(self):
        return f"<Feature(feature_id={self.feature_id}, speed_km={self.speed_km}, car_cc={self.car_cc}, fuel_type={self.fuel_type}, Vehicle: {self.vehicle_id})>"


class Vehicle(db.Model):
    __tablename__ = 'vehicles'

    vehicle_id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(128), nullable=False)
    model = db.Column(db.String(128), nullable=False)
    car_image = db.Column(db.String(128), nullable=True)
    year = db.Column(db.Integer, nullable=False)
    price = db.Column(db.String, nullable=False)
    description = db.Column(db.String(1024), nullable=True)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)

    # Relationship with Owner (one-to-many)
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.owner_id'))
    owner = db.relationship("Owner", back_populates="vehicles")

    # Relationship with Feature (many-to-many)
    features = db.relationship("Feature", secondary="vehicle_features", back_populates="vehicles")

    def __repr__(self):
        return f'<Vehicle(id={self.vehicle_id}, make={self.make}, model={self.model})>'


class Rental(db.Model):
    __tablename__ = 'rentals'

    customer_name = db.Column(db.String, nullable=False)
    rental_id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.vehicle_id')) 
    duration_days = db.Column(db.Integer, nullable=False)
    price = db.Column(db.String, nullable=False)  
    
    # Relationship with Vehicle (one-to-one)
    vehicle = db.relationship("Vehicle", backref=db.backref('rental', uselist=False))

    def __repr__(self):
        return f"Customer Name: {self.customer_name} - Rental ID: {self.rental_id} - Vehicle: {self.vehicle_id} - Duration: {self.duration_days} days"


# Association table (many-to-many relationship between Vehicle and Feature)
class VehicleFeatures(db.Model):
    __tablename__ = 'vehicle_features'

    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.vehicle_id'), primary_key=True)
    feature_id = db.Column(db.Integer, db.ForeignKey('features.feature_id'), primary_key=True)


    def __repr__(self):
        return f"<VehicleFeatures(vehicle_id={self.vehicle_id}, feature_id={self.feature_id})>"

      
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

