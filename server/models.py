from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class EmployeeMeeting(db.Model, SerializerMixin):
    __tablename__ = 'employee_meetings'

    serialize_rules = ('-meetings.employee_meetings', '-employees.employee_meetings',)


    id = db.Column(db.Integer, primary_key=True)
    rsvp = db.Column(db.Boolean)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    meeting_id = db.Column(db.Integer, db.ForeignKey('meetings.id'))

    employee = db.relationship('Employee', back_populates='employee_meetings')
    meeting = db.relationship('Meeting', back_populates='employee_meetings')

    def to_dict(self):
        return {
            'id': self.id,
            'rsvp': self.rsvp,
            'employee_id': self.employee_id,
            'meeting_id': self.meeting_id,
            'employee': self.employee.name,
            'meeting': self.meeting.topic
        }

    def __repr__(self):
        return f'<EmployeeMeeting Employee: {self.employee}, Meeting: {self.meeting}, RSVP: {self.rsvp}>'

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    serialize_rules = ('-employee_meetings.employees',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    hire_date = db.Column(db.Date, nullable=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('managers.id'))

    manager = db.relationship('Manager', back_populates='employees')
    employee_meetings = db.relationship('EmployeeMeeting', back_populates='employee')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'hire_date': self.hire_date,
            'manager': self.manager.to_dict() if self.manager else None,
            'employee_meetings': [emp_meeting.to_dict() for emp_meeting in self.employee_meetings],
        }

    def __repr__(self):
        return f'<Employee {self.id}, {self.name}, {self.hire_date}>'

    @validates('name')
    def validate_name(self, key, name):
        if not isinstance(name, str):
            raise ValueError('Invalid name')
        if len(name) <= 3:
            raise ValueError('Name must be at least 3 characters')
        return name
    
    @validates('manager_id')
    def validate_manager_id(self, key, manager_id):
        if not isinstance(manager_id, int):
            raise ValueError('Invalid manager ID')
        return manager_id


class Meeting(db.Model, SerializerMixin):
    __tablename__ = 'meetings'

    serialize_rules = ('-employee_meetings.meetings',)  # Avoid recursion by excluding employees

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String)
    scheduled_time = db.Column(db.DateTime)
    location = db.Column(db.String)

    employee_meetings = db.relationship('EmployeeMeeting', back_populates='meeting')

    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'scheduled_time': self.scheduled_time,
            'location': self.location,
            'employee_meetings': [emp_meeting.to_dict() for emp_meeting in self.employee_meetings],
        }

    def __repr__(self):
        return f'<Meeting {self.id}, {self.topic}, {self.scheduled_time}, {self.location}>'

    @validates('topic')
    def validate_topic(self, key, topic):
        if not isinstance(topic, str):
            raise ValueError('Invalid topic')
        return topic

    @validates('scheduled_time')
    def validate_scheduled_time(self, key, scheduled_time):
        if not isinstance(scheduled_time, datetime):
            raise ValueError('Invalid scheduled time')
        return scheduled_time

    @validates('location')
    def validate_location(self, key, location):
        if not isinstance(location, str):
            raise ValueError('Invalid location')
        return location


class Manager(db.Model, SerializerMixin):
    __tablename__ = 'managers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    department = db.Column(db.String, nullable=False)

    employees = db.relationship('Employee', back_populates='manager')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'employees': [employee.name for employee in self.employees]
        }

    def __repr__(self):
        return f'<Manager {self.id}, {self.name}, {self.department}>'

    @validates('name')
    def validate_name(self, key, name):
        if not isinstance(name, str):
            raise ValueError('Invalid name')
        return name

    @validates('department')
    def validate_department(self, key, department):
        if not isinstance(department, str):
            raise ValueError('Invalid department')
        return department








