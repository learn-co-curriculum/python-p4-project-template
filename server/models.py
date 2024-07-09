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
