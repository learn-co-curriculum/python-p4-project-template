from app import db, bcrypt
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Stay(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'location': self.location,
            'price': self.price,
            'description': self.description,
            'user_id': self.user_id
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stay_id = db.Column(db.Integer, db.ForeignKey('stay.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.String, nullable=False)
    end_date = db.Column(db.String, nullable=False)
    note = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'stay_id': self.stay_id,
            'user_id': self.user_id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'note': self.note
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stay_id = db.Column(db.Integer, db.ForeignKey('stay.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'stay_id': self.stay_id,
            'user_id': self.user_id,
            'rating': self.rating,
            'comment': self.comment
        }
