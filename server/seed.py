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

    from models import Symptom

    # Create symptoms
    symptom1 = Symptom(name='Fever', diagnosis='Common cold')
    symptom2 = Symptom(name='Fracture', diagnosis='Broken leg')
    symptom3 = Symptom(name='Cough', diagnosis='Bronchitis')

    # Add symptoms to session
    db.session.add_all([symptom1, symptom2, symptom3])
    db.session.commit()
