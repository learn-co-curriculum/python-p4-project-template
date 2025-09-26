from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import DateTime
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from config import db

# Models go here!
class Owner(db.Model, SerializerMixin):
    __tablename__ = 'owners'

    # Serialization rules
    serialize_rules = ('-properties.owner' ,)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    # Relationships
    properties = db.relationship('Property', backref='owner', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
            return f"<Owner {self.name}>"
     
class Property(db.Model, SerializerMixin):
    __tablename__ = 'properties'

     # Serialization rules

    serialize_rules = ('-owner.properties', '-bookings.property',)


    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price_per_night = db.Column(db.Float, nullable=False)
    max_guests = db.Column(db.Integer, nullable=False)
    amenities = db.Column(db.Text, nullable=True)  # Could be JSON string
    owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)


    # Relationships
    bookings = db.relationship('Booking', backref='property', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('PropertyImage', backref='property', lazy=True, cascade='all, delete-orphan')


    # Association proxy for many-to-many relationship with guests through bookings
    guests = association_proxy('bookings', 'guest_email')

    #  method to get the featured image
    def get_featured_image(self):
        featured = PropertyImage.query.filter_by(property_id=self.id, is_featured=True).first()
        if featured:
            return featured.image_url
    
    def __repr__(self):
        return f'<Property {self.name}>'
     
class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'
    
    # Serialization rules
    serialize_rules = ('-property.bookings',)
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    guest_name = db.Column(db.String(100), nullable=False)
    guest_email = db.Column(db.String(120), nullable=False)
    check_in_date = db.Column(db.Date, nullable=False)
    check_out_date = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    booking_status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Booking {self.guest_name} - Property {self.property_id}>'
class PropertyImage(db.Model, SerializerMixin):
    __tablename__ = 'property_images'
    
    # Serialization rules
    serialize_rules = ('-property.images',)
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    image_name = db.Column(db.String(100), nullable=False)
    is_featured = db.Column(db.Boolean, default=False)  # Main property image
    upload_order = db.Column(db.Integer, default=0)  # For image ordering
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<PropertyImage {self.image_name}>'


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-password_hash',)  # Never serialize password
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    user_type = db.Column(db.String(20), default='guest')  # guest, owner
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)        
class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('favorites', lazy=True))
    property = db.relationship('Property', backref=db.backref('favorited_by', lazy=True))
    
    # Ensure a user can't favorite the same property twice
    __table_args__ = (db.UniqueConstraint('user_id', 'property_id', name='unique_user_property_favorite'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'property_id': self.property_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }