from sqlalchemy import Table, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

Base = declarative_base()

# Doctor model
class Doctor(Base, SerializerMixin):
    _tablename_ = 'doctor'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default='Active')
    patients = relationship('Patient', backref='doctor', lazy=True)