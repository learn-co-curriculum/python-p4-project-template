from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    routines = db.relationship('RoutineItem', back_populates="users")
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password = db.Column(db.String, nullable=False)

    @hybrid_property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self._password = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8') 

    def verify_password(self, password):
        return bcrypt.check_password_hash(self._password, password.encode('utf-8'))

    routines = db.relationship('RoutineItem', back_populates="user")
    serialize_rules = ('-routines.user',)

    def __repr__(self):
        return f'<User {self.name}>'


class Exercise(db.Model, SerializerMixin):
    __tablename__ = "exercises"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    muscle_group = db.Column(db.String, nullable=False)
    difficulty_level = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)

    routines = db.relationship('RoutineItem', back_populates="exercise")
    serialize_rules = ('-routines.exercise',)

    def __repr__(self):
        return f'<Exercise {self.name}, Muscle Group: {self.muscle_group}, Difficulty: {self.difficulty_level}>'


class RoutineItem(db.Model, SerializerMixin):
    __tablename__ = "routine_items"

    id = db.Column(db.Integer, primary_key=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), nullable=False)
    initial_weight = db.Column(db.Integer)
    current_weight = db.Column(db.Integer)
    initial_reps = db.Column(db.Integer)
    current_reps = db.Column(db.Integer)
    initial_sets = db.Column(db.Integer)
    current_sets = db.Column(db.Integer)
    priority = db.Column(db.Integer)
    day_of_the_week = db.Column(db.String)

    user = db.relationship('User', back_populates="routines")
    exercise = db.relationship('Exercise', back_populates="routines")

    serialize_rules = ('-user.routines','-exercise.routines')

    @validates('user_id','exercise_id')
    def validate_fks(self, key, value):
        if not value:
            raise ValueError(f'ForeignKey {key} must be set')
        return value
    
    #@validates('priority','day_of_the_week')

    @validates('inital_weight','initial_reps','initial_sets')
    def validate_initial(self, key, value):
        if not value:
            raise ValueError(f'To reach your fitness goal, your regimen must be properly entered. {key} is missing.')
        return value
    
    @validates('current_weight','current_reps','current_sets')
    def validate_current(self, key, value):
        if not value:
            raise ValueError(f'Way to go! But {key} is missing.')
        return value
    