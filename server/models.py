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

# Doctor model
class Doctor(Base, SerializerMixin):
    __tablename__ = 'doctor'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default='Active')
    patients = relationship('Patient', backref='doctor', lazy=True)

# Patient model
class Patient(Base, SerializerMixin):
    __tablename__ = 'patient'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctor.id'), nullable=False)
    symptoms = relationship('Symptom', secondary='patient_symptom', backref='patients')

# Symptom model
class Symptom(Base, SerializerMixin):
    __tablename__ = 'symptom'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    diagnosis = Column(String(100), nullable=False)
    patients = relationship('Patient', secondary='patient_symptom', backref='symptoms')
