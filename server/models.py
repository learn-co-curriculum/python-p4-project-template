
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import DateTime
from datetime import datetime
import bcrypt

from config import db

# Link table for Reading ↔ Meal (includes user-submitted carbs_amount)
reading_meals = db.Table('reading_meals',
    db.Column('reading_id', db.Integer, db.ForeignKey('readings.id'), primary_key=True),
    db.Column('meal_id', db.Integer, db.ForeignKey('meals.id'), primary_key=True),
    db.Column('carbs_amount', db.Float, nullable=True),  # User submittable attribute
    db.Column('created_at', DateTime, default=datetime.utcnow)
)

class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(30), nullable=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)

    # Relationships
    patients = db.relationship('User', back_populates='doctor', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
        }

class BMISnapshot(db.Model):
    """Historical BMI snapshots for users"""
    __tablename__ = 'bmi_snapshots'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bmi = db.Column(db.Float, nullable=True)
    weight_kg = db.Column(db.Float, nullable=True)
    height_cm = db.Column(db.Float, nullable=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='bmi_snapshots')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bmi': self.bmi,
            'weight_kg': self.weight_kg,
            'height_cm': self.height_cm,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Users of the app
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128))
    # Profile fields
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(10), nullable=True)  # male, female, other
    # Optional: user's diabetes type (e.g., type1, type2, gestational, prediabetes)
    diabetes_type = db.Column(db.String(30), nullable=True)
    # BMI-related fields (optional)
    height_cm = db.Column(db.Float, nullable=True)
    weight_kg = db.Column(db.Float, nullable=True)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    # One doctor per user (optional)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=True)
    # Emergency contact
    emergency_contact_name = db.Column(db.String(100), nullable=True)
    emergency_contact_phone = db.Column(db.String(20), nullable=True)
    # Last hospital visit for reminders
    last_hospital_visit = db.Column(db.Date, nullable=True)
    
    # Relationships
    readings = db.relationship('Reading', backref='user', lazy=True, cascade='all, delete-orphan')
    medications = db.relationship('Medication', backref='user', lazy=True, cascade='all, delete-orphan')
    doctor = db.relationship('Doctor', back_populates='patients')
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.hashpw(
            password.encode('utf-8'), bcrypt.gensalt())
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.checkpw(
            password.encode('utf-8'),
            self._password_hash.encode('utf-8'))
    
    @hybrid_property
    def bmi(self):
        """Calculate BMI: weight (kg) / (height (m))²"""
        if self.weight_kg and self.height_cm:
            height_m = self.height_cm / 100
            return round(self.weight_kg / (height_m ** 2), 1)
        return None
    
    @hybrid_property
    def bmi_category(self):
        """Get BMI category based on WHO standards"""
        bmi_value = self.bmi
        if not bmi_value:
            return None
        
        if bmi_value < 18.5:
            return "Underweight"
        elif bmi_value < 25:
            return "Normal weight"
        elif bmi_value < 30:
            return "Overweight"
        else:
            return "Obese"
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'gender': self.gender,
            'diabetes_type': self.diabetes_type,
            'height_cm': self.height_cm,
            'weight_kg': self.weight_kg,
            'bmi': self.bmi,
            'bmi_category': self.bmi_category,
            'doctor_id': self.doctor_id,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'last_hospital_visit': self.last_hospital_visit.isoformat() if self.last_hospital_visit else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<User {self.name}>'

class Reading(db.Model):  # Blood glucose reading
    __tablename__ = 'readings'
    
    id = db.Column(db.Integer, primary_key=True)
    value = db.Column(db.Float, nullable=False)  # Blood sugar value in mg/dL
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    notes = db.Column(db.Text)
    # pre_meal, post_meal, fasting, bedtime, random
    context = db.Column(db.String(20), nullable=True)
    # Flag for abnormal readings
    is_flagged = db.Column(db.Boolean, default=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Foreign key - belongs to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Many-to-many with Meals
    meals = db.relationship('Meal', secondary=reading_meals, back_populates='readings')
    
    @hybrid_property
    def glucose_status(self):
        """Determine if glucose reading is normal, high, or low"""
        if not self.value:
            return None
            
        # General guidelines (mg/dL)
        if self.context == 'fasting':
            if self.value < 70:
                return 'low'
            elif self.value <= 100:
                return 'normal'
            elif self.value <= 125:
                return 'prediabetic'
            else:
                return 'high'
        elif self.context == 'post_meal':
            if self.value < 70:
                return 'low'
            elif self.value <= 140:
                return 'normal'
            elif self.value <= 199:
                return 'prediabetic'
            else:
                return 'high'
        else:  # pre_meal, random, bedtime
            if self.value < 70:
                return 'low'
            elif self.value <= 130:
                return 'normal'
            elif self.value <= 180:
                return 'elevated'
            else:
                return 'high'
    
    def to_dict(self):
        return {
            'id': self.id,
            'value': self.value,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.isoformat() if self.time else None,
            'notes': self.notes,
            'context': self.context,
            'glucose_status': self.glucose_status,
            'is_flagged': self.is_flagged,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id
        }
    
    def __repr__(self):
        return f'<Reading {self.value} on {self.date}>'

class Medication(db.Model):  # Medication reminder
    __tablename__ = 'medications'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    dose = db.Column(db.String(50), nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pending')  # taken/missed/pending
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Foreign key - belongs to User
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'dose': self.dose,
            'time': self.time.isoformat() if self.time else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id
        }
    
    def __repr__(self):
        return f'<Medication {self.name} - {self.dose}>'

class Meal(db.Model):  # Logged meal
    __tablename__ = 'meals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    meal_type = db.Column(db.String(20))  # breakfast, lunch, dinner, snack
    description = db.Column(db.Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Many-to-many with Readings
    readings = db.relationship('Reading', secondary=reading_meals, back_populates='meals')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'meal_type': self.meal_type,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Meal {self.name}>'

class Reminder(db.Model):
    """Reminders for glucose readings and hospital visits"""
    __tablename__ = 'reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reminder_type = db.Column(db.String(20), nullable=False)  # glucose, hospital, medication
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=True)
    scheduled_time = db.Column(db.Time, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    frequency = db.Column(db.String(20), default='daily')  # daily, weekly, monthly
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='reminders')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'reminder_type': self.reminder_type,
            'title': self.title,
            'message': self.message,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'is_active': self.is_active,
            'frequency': self.frequency,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class EducationalTip(db.Model):
    """Educational tips and insights for users"""
    __tablename__ = 'educational_tips'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)  # food, exercise, general, emergency
    condition = db.Column(db.String(50), nullable=True)  # high_glucose, low_glucose, normal
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    local_relevance = db.Column(db.Boolean, default=False)  # Kenya-specific content
    priority = db.Column(db.String(10), default='medium')  # high, medium, low
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'condition': self.condition,
            'title': self.title,
            'content': self.content,
            'local_relevance': self.local_relevance,
            'priority': self.priority,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class DoctorMessage(db.Model):
    """Messages between users and doctors"""
    __tablename__ = 'doctor_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    sender_type = db.Column(db.String(10), nullable=False)  # user, doctor
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    is_emergency = db.Column(db.Boolean, default=False)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='messages')
    doctor = db.relationship('Doctor', backref='messages')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'doctor_id': self.doctor_id,
            'sender_type': self.sender_type,
            'message': self.message,
            'is_read': self.is_read,
            'is_emergency': self.is_emergency,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
