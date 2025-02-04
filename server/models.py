from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="guest")  # "guest" or "host"

    def __repr__(self):
        return f"<User {self.name}>"

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    price_per_night = db.Column(db.Float, nullable=False)
    thumbnail = db.Column(db.String(200))  # URL to the image
    host_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    host = db.relationship("User", backref="properties")

    def __repr__(self):
        return f"<Property {self.title}>"

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("property.id"), nullable=False)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    guest = db.relationship("User", backref="bookings")
    property = db.relationship("Property", backref="bookings")

    def __repr__(self):
        return f"<Booking {self.id}>"

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("property.id"), nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 scale
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    property = db.relationship("Property", backref="reviews")
    guest = db.relationship("User", backref="reviews")

    def __repr__(self):
        return f"<Review {self.id}>"
