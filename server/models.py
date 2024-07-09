from sqlalchemy import Table, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

Base = declarative_base()

# Association table for patient symptoms
patient_symptom = Table('patient_symptom',
                        Base.metadata,
                        Column('patient_id', Integer, ForeignKey('patient.id')),
                        Column('symptom_id', Integer, ForeignKey('symptom.id')),
                        Column('diagnosis', String(100))
                        )

# Models go here!
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    symptoms = db.relationship('Symptom', secondary='patient_symptom', backref='patients')
