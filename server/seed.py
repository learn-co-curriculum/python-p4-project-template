from app import app, db
from models import User, Expense
from datetime import date

with app.app_context():
    db.drop_all()  # Optional: Clears the database
    db.create_all()

    user1 = User(username="testuser")
    user1.set_password("password123")

    expense1 = Expense(
        name="Groceries",
        amount=50.25,
        category="Food",
        date=date(2024, 1, 1),
        user=user1
    )

    db.session.add(user1)
    db.session.add(expense1)
    db.session.commit()

    print("Database seeded successfully!")