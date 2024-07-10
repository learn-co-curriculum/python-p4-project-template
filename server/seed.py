#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

from models import Patient, PatientSymptom

    # Create patients
    patient1 = Patient(name='John Doe', age=35, gender='Male', doctor_id=1)
    patient2 = Patient(name='Jane Smith', age=28, gender='Female', doctor_id=1)
    patient3 = Patient(name='Michael Brown', age=42, gender='Male', doctor_id=2)

    # Add patients to session
    db.session.add_all([patient1, patient2, patient3])
    db.session.commit()

    # Associate patients with symptoms
    patient_symptom1 = PatientSymptom(patient_id=1, symptom_id=1, diagnosis='Flu')
    patient_symptom2 = PatientSymptom(patient_id=2, symptom_id=3, diagnosis='Respiratory infection')
    patient_symptom3 = PatientSymptom(patient_id=3, symptom_id=2, diagnosis='Sports injury')

    # Add associations to session
    db.session.add_all([patient_symptom1, patient_symptom2, patient_symptom3])
    db.session.commit()
