from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import re

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)


class Freelancer(db.Model, SerializerMixin):
    __tablename__ = "freelancers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False)
    rate = db.Column(db.Integer)  # Adding rate field for freelancer's rate

    # relationship with Project
    projects = db.relationship(
        'Project', back_populates='freelancer', cascade='all, delete-orphan'
    )

    # proxy to easily access clients through Project
    clients = association_proxy('projects', 'client')

    # serialization rules
    serialize_rules = ('-projects.freelancer', '-clients.freelancers')

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email address")
        return email

    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3 or len(username) > 20:
            raise ValueError("Username must be between 3 and 20 characters")
        if not re.match(r"^\w+$", username):
            raise ValueError("Username must contain only letters, numbers, and underscores")
        existing_user = db.session.query(Freelancer).filter_by(username=username).first()
        if existing_user:
            raise ValueError("Username already exists")
        return username

    def __repr__(self):
        return f"<Freelancer {self.name}>"


class Client(db.Model, SerializerMixin):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False)

    # relationship with Project
    projects = db.relationship(
        'Project', back_populates='client', cascade='all, delete-orphan'
    )

    # proxy to easily access freelancers through Project
    freelancers = association_proxy('projects', 'freelancer')

    # serialization rules
    serialize_rules = ('-projects.client', '-freelancers.clients')

    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError("Invalid email address")
        return email

    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3 or len(username) > 20:
            raise ValueError("Username must be between 3 and 20 characters")
        if not re.match(r"^\w+$", username):
            raise ValueError("Username must contain only letters, numbers, and underscores")
        existing_user = db.session.query(Client).filter_by(username=username).first()
        if existing_user:
            raise ValueError("Username already exists")
        return username

    def __repr__(self):
        return f"<Client {self.name}>"


class Project(db.Model, SerializerMixin):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    rate = db.Column(db.Integer, nullable=False)

    # relationships
    freelancer_id = db.Column(db.Integer, db.ForeignKey('freelancers.id'), nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=False)

    freelancer = db.relationship('Freelancer', back_populates='projects')
    client = db.relationship('Client', back_populates='projects')

    # serialization rules
    serialize_rules = ('-freelancer.projects', '-client.projects')

    # validation
    @validates('rate')
    def validate_rate(self, key, rate):
        if float(rate) < 10 or float(rate) > 1000:
            raise ValueError("Rate must be between 10 and 1000")
        return rate

    @validates('freelancer_id')
    def validate_freelancer_id(self, key, freelancer_id):
        freelancer = db.session.query(Freelancer).get(freelancer_id)
        if freelancer is None:
            raise ValueError("Freelancer ID does not exist")
        return freelancer_id

    @validates('client_id')
    def validate_client_id(self, key, client_id):
        client = db.session.query(Client).get(client_id)
        if client is None:
            raise ValueError("Client ID does not exist")
        return client_id

    def __repr__(self):
        return f"<Project ${self.rate}>"
