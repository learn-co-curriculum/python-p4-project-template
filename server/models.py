from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Symptom model
class Symptom(Base, SerializerMixin):
    _tablename_ = 'symptom'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    diagnosis = Column(String(100), nullable=False)
    patients = relationship('Patient', secondary='patient_symptom', backref='symptoms')

# Models go here!
