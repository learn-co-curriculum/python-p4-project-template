from app import db
from models import Card, User  # Adjust imports if necessary
from werkzeug.security import generate_password_hash

def seed_cards():
    card_urls = [
        "Home.jpeg",
        "350.jpeg",
        "Elegant House Design.jpeg",
    ]

    for url in card_urls:
        card = Card(url=url)
        db.session.add(card)
    
    db.session.commit()
    print("Cards have been seeded successfully.")

def seed_users():
    users = [
        {"name": "John Doe", "email": "john.doe@example.com", "password": "password123"},
        {"name": "Jane Smith", "email": "jane.smith@example.com", "password": "password456"},
    ]

    for user_data in users:
        hashed_password = generate_password_hash(user_data["password"], method="sha256")
        user = User(name=user_data["name"], email=user_data["email"], password=hashed_password)
        db.session.add(user)

    db.session.commit()
    print("Users have been seeded successfully.")

if __name__ == "__main__":
    seed_cards()
    seed_users()
    print("Seeding completed.")
