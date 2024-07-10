from config import db
print('Database seeded successfully.')

if __name__ == '__main__':
    seed_data()
from models import Doctor

# Function to seed initial data
def seed_data():
    # Create doctors
    doctor1 = Doctor(name='Dr. Shukri', specialty='Cardiology')
    doctor2 = Doctor(name='Dr. wayne', specialty='Pediatrics')
    doctor3 = Doctor(name='Dr. Lee', specialty='Orthopedics')

    db.session.add_all([doctor1, doctor2, doctor3])
    db.session.commit()