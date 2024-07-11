from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

# from config import db
from datetime import datetime

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)



class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    events = db.relationship('Event', back_populates="creator", cascade = 'all, delete-orphan')
   
    # Serialization rules
    serialize_rules = ('-password_hash','-events.users', )

    def __repr__(self):
     return f"<User {self.username}>"
    
class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(128), nullable=False)
    no_of_registrations = db.Column(db.Integer, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    creator = db.relationship('User', back_populates = 'events')
    registrations = db.relationship('Registration', back_populates = 'event', cascade = 'all, delete-orphan', lazy=True)

    # Serialization rules
    serialize_rules = ('-creator.events', '-registrations.events',)

    def __repr__(self):
        return f"<Event {self.title} at {self.location} on {self.date}>"

    @staticmethod
    def validate_date(date):
        if date < func.now():
            raise ValueError("The event date cannot be in the past.")

class Registration(db.Model, SerializerMixin):
    __tablename__ = 'registrations'

    id = db.Column(db.Integer, primary_key=True)
    review = db.Column(db.Text, nullable=True)
    registered_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

    event = db.relationship('Event', back_populates='registrations')
   
    # Serialization rules
    serialize_rules = ('-event.registrations',)

    def __repr__(self):
        return f"<Registration {self.id} by User {self.user_id} for Event {self.event_id}>"

    @staticmethod
    def validate_user_data(data):
        if 'username' not in data or len(data['username']) < 3:
            return "Username must be at least 3 characters long."
        if 'email' not in data or not '@' in data['email']:
            return "Invalid email address."
        if 'password' not in data or len(data['password']) < 6:
            return "Password must be at least 6 characters long."
            return None

    @staticmethod
    def validate_event_data(data):
        if 'title' not in data or len(data['title']) < 5:
            return "Event title must be at least 5 characters long."
        if 'description' not in data or len(data['description']) < 10:
            return "Event description must be at least 10 characters long."
        if 'date' not in data:
            return "Event date is required."
        if 'location' not in data or len(data['location']) < 3:
            return "Event location must be at least 3 characters long."

            try:
                event_date = datetime.strptime(data['date'], '%Y-%m-%dT%H:%M:%S')
                Event.validate_date(event_date)
            except ValueError as e:
                    return str(e)
                    return None
