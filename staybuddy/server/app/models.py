from app import db, bcrypt
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Many-to-many association table with user submittable attribute
class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stay_id = db.Column(db.Integer, db.ForeignKey('stay.id'), nullable=False)
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # User submittable attribute
    notes = db.Column(db.String(200))  # Additional user submittable attribute

    # Relationships
    user = db.relationship('User', back_populates='favorites')
    stay = db.relationship('Stay', back_populates='favorited_by')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'stay_id': self.stay_id,
            'date_added': self.date_added.isoformat(),
            'notes': self.notes
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20))  

    # One-to-many relationships
    stays = db.relationship('Stay', back_populates='host', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', back_populates='guest', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='author', lazy=True, cascade='all, delete-orphan')

    # Many-to-many relationship (User favorites)
    favorites = db.relationship('Favorite', back_populates='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone
        }

class Stay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # One-to-many relationships
    host = db.relationship('User', back_populates='stays')
    bookings = db.relationship('Booking', back_populates='stay', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='stay', lazy=True, cascade='all, delete-orphan')

    # Many-to-many relationship (Stay favorites)
    favorited_by = db.relationship('Favorite', back_populates='stay', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'price': self.price,
            'description': self.description,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'host': self.host.to_dict() if self.host else None,
            'reviews_count': len(self.reviews),
            'average_rating': sum([r.rating for r in self.reviews]) / len(self.reviews) if self.reviews else 0
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stay_id = db.Column(db.Integer, db.ForeignKey('stay.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.String, nullable=False)
    end_date = db.Column(db.String, nullable=False)
    note = db.Column(db.String(255))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Many-to-one relationships
    stay = db.relationship('Stay', back_populates='bookings')
    guest = db.relationship('User', back_populates='bookings')

    def to_dict(self):
        return {
            'id': self.id,
            'stay_id': self.stay_id,
            'user_id': self.user_id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'note': self.note,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'stay': self.stay.to_dict() if self.stay else None
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stay_id = db.Column(db.Integer, db.ForeignKey('stay.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Many-to-one relationships
    stay = db.relationship('Stay', back_populates='reviews')
    author = db.relationship('User', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'stay_id': self.stay_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat(),
            'author': self.author.to_dict() if self.author else None
        }
