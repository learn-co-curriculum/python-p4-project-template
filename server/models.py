from sqlalchemy import Table, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

Base = declarative_base()


# Symptom model
class Symptom(Base, SerializerMixin):
    _tablename_ = 'symptom'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    diagnosis = Column(String(100), nullable=False)
    patients = relationship('Patient', secondary='patient_symptom', backref='symptoms')

# Models go here!
