from app import app, db
from models import User, Expense, Category
from datetime import date

with app.app_context():
    db.drop_all()
    db.create_all()

    # Seed categories
    food = Category(name="Food")
    entertainment = Category(name="Entertainment")
    subscriptions = Category(name="Subscriptions")
    miscellaneous = Category(name="Miscellaneous")
    housing = Category(name="Housing")

    db.session.add_all([food, entertainment, subscriptions, miscellaneous, housing])

    # Seed a user
    user1 = User(username="testuser")
    user1.set_password("password123")

    db.session.add(user1)
    db.session.commit()

    print("Database seeded successfully!")