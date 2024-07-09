from config import db
from models import Doctor, Patient, Symptom, PatientSymptom

# Function to seed initial data
def seed_data():
    # Create doctors
    doctor1 = Doctor(name='Dr. Smith', specialty='Cardiology')
    doctor2 = Doctor(name='Dr. Johnson', specialty='Pediatrics')
    doctor3 = Doctor(name='Dr. Lee', specialty='Orthopedics')

    # Add doctors to session
    db.session.add_all([doctor1, doctor2, doctor3])
    db.session.commit()

    # Create patients
    patient1 = Patient(name='John Doe', age=35, gender='Male', doctor_id=1)
    patient2 = Patient(name='Jane Smith', age=28, gender='Female', doctor_id=1)
    patient3 = Patient(name='Michael Brown', age=42, gender='Male', doctor_id=2)

    # Add patients to session
    db.session.add_all([patient1, patient2, patient3])
    db.session.commit()

    # Create symptoms
    symptom1 = Symptom(name='Fever', diagnosis='Common cold')
    symptom2 = Symptom(name='Fracture', diagnosis='Broken leg')
    symptom3 = Symptom(name='Cough', diagnosis='Bronchitis')

    # Add symptoms to session
    db.session.add_all([symptom1, symptom2, symptom3])
    db.session.commit()

    # Associate patients with symptoms
    patient_symptom1 = PatientSymptom(patient_id=1, symptom_id=1, diagnosis='Flu')
    patient_symptom2 = PatientSymptom(patient_id=2, symptom_id=3, diagnosis='Respiratory infection')
    patient_symptom3 = PatientSymptom(patient_id=3, symptom_id=2, diagnosis='Sports injury')

    # Add associations to session
    db.session.add_all([patient_symptom1, patient_symptom2, patient_symptom3])
    db.session.commit()

    print('Database seeded successfully.')

if __name__ == '__main__':
    seed_data()
