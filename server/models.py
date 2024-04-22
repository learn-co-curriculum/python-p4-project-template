from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin

# Association table for many-to-many relationship between TimeLogs and Departments
user_time_log = db.Table(
    'user_time_log',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('timelog_id', db.Integer, db.ForeignKey('time_log.id'), primary_key=True),
    db.Column('department_id', db.Integer, db.ForeignKey('department.id'), primary_key=True)
)

class Role(db.Model, SerializerMixin):
    serialize_rules = (
        '-users.role',           # Exclude direct serialization of users to avoid recursion
    )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    description = db.Column(db.Text)
    users = db.relationship('User', back_populates='role')

# Department model

class Department(db.Model, SerializerMixin):
    serialize_rules = (
        '-users.department', 
        '-time_logs.department' 
               
    )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    users = db.relationship('User', back_populates='department')
    time_logs = db.relationship('TimeLog', secondary=user_time_log, back_populates='departments')

    

class User(db.Model, SerializerMixin):
    serialize_rules = (
        '-password_hash',        # Exclude password hash
        '-time_logs.user',
        '-role.users',
        '-department.user'
    )
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    time_logs = db.relationship('TimeLog', backref='user')
    role = db.relationship('Role', back_populates='users')
    department = db.relationship('Department', back_populates='users')

class TimeLog(db.Model, SerializerMixin):
    serialize_rules = (
        '-user.password_hash',   # Exclude user's password hash  
        '-departments.users',    # Exclude other users in the departments to avoid recursion
        '-departments.time_logs',
        '-user.time_logs', # Exclude other time logs in the departments to avoid recursion
        '-user.role',
        '-user.department',
    )
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    clock_in = db.Column(db.Time, nullable=False)
    clock_out = db.Column(db.Time)
    hours_worked= db.Column(db.Numeric)
    total_hours = db.Column(db.Numeric)
    status = db.Column(db.String(20), nullable=False)  # Pending, Approved, Rejected
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    departments = db.relationship('Department', secondary=user_time_log, back_populates='time_logs')
