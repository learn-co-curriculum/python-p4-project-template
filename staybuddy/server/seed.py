# server/seed.py

from app import create_app, db
from datetime import date

app = create_app()

with app.app_context():
    print("🌱 Seeding database...")

    # Import models after app context is established
    from app.models import User, Stay, Booking, Review

    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    print("✅ Database tables created!")

    # --------------------
    # Create Users
    # --------------------
    user1 = User(username="john", email="john@example.com")
    user1.set_password("secret123")
    user2 = User(username="sarah", email="sarah@example.com")
    user2.set_password("password456")

    db.session.add_all([user1, user2])
    db.session.commit()

    # --------------------
    # Create Stays
    # --------------------
    stay1 = Stay(title="Ocean View Apartment", location="Mombasa", price=3500, description="Enjoy a sea breeze with a coastal view.", user_id=user1.id)
    stay2 = Stay(title="Nairobi CBD Loft", location="Nairobi", price=2800, description="Perfect for business trips!", user_id=user2.id)

    db.session.add_all([stay1, stay2])
    db.session.commit()

    # --------------------
    # Create Bookings
    # --------------------
    booking1 = Booking(user_id=user2.id, stay_id=stay1.id, start_date=date(2025, 7, 1), end_date=date(2025, 7, 4), note="Anniversary getaway")
    booking2 = Booking(user_id=user1.id, stay_id=stay2.id, start_date=date(2025, 8, 10), end_date=date(2025, 8, 13), note="Business trip")

    db.session.add_all([booking1, booking2])
    db.session.commit()

    # --------------------
    # Create Reviews
    # --------------------
    review1 = Review(user_id=user2.id, stay_id=stay1.id, rating=5, comment="Amazing view and hospitality!")
    review2 = Review(user_id=user1.id, stay_id=stay2.id, rating=4, comment="Very central and clean.")

    db.session.add_all([review1, review2])
    db.session.commit()

    print("✅ Done seeding!")
