from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db


# Patient model
class Patient(Base, SerializerMixin):
    __tablename__ = 'patient'
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctor.id'), nullable=False)
    symptoms = relationship('Symptom', secondary='patient_symptom', backref='patients')

# Models go here!
