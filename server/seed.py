
#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports

from faker import Faker
from app import app
from models import db, User, MenuItem, Order
from datetime import datetime

with app.app_context():
    fake = Faker()

    # Delete all records/rows in the tables
    print("Deleting data...")
    User.query.delete()
    MenuItem.query.delete()
    Order.query.delete()

    print("Creating users...")
    users = []
    for _ in range(10):
        username = fake.user_name()
        email = fake.email()
        password = fake.password()
        role = fake.random_element(elements=('user', 'admin'))
        users.append(User(username=username, email=email, password=password, role=role))

    db.session.add_all(users)
    db.session.commit()

    print("Creating menu items...")
    menu_items = []

    # Predefined lists of food items
    drinks = [
        {"name": "Coca Cola", "description": "Chilled and refreshing cola drink"},
        {"name": "Orange Juice", "description": "Freshly squeezed orange juice"},
        {"name": "Coffee", "description": "Hot brewed coffee with a rich aroma"},
        {"name": "Tea", "description": "Hot tea with a hint of lemon"},
        {"name": "Smoothie", "description": "Mixed fruit smoothie with yogurt"}
    ]

    breakfast_items = [
        {"name": "Pancakes", "description": "Fluffy pancakes served with syrup"},
        {"name": "Omelette", "description": "Cheese and vegetable omelette"},
        {"name": "French Toast", "description": "French toast topped with powdered sugar"},
        {"name": "Bagel", "description": "Freshly baked bagel with cream cheese"},
        {"name": "Yogurt Parfait", "description": "Layers of yogurt, granola, and fruit"}
    ]

    lunch_items = [
        {"name": "Burger", "description": "Juicy beef burger with lettuce and tomato"},
        {"name": "Caesar Salad", "description": "Crispy romaine with Caesar dressing"},
        {"name": "Grilled Chicken Sandwich", "description": "Grilled chicken on a toasted bun"},
        {"name": "Tacos", "description": "Soft tacos with beef and fresh toppings"},
        {"name": "Pizza", "description": "Cheese pizza with a crispy crust"}
    ]

    # Add predefined items to the menu_items list
    for item in drinks + breakfast_items + lunch_items:
        price = round(fake.random_number(digits=2, fix_len=False) + fake.random.random(), 2)
        menu_items.append(MenuItem(name=item["name"], description=item["description"], price=price))

    db.session.add_all(menu_items)
    db.session.commit()

    print("Creating orders...")
    orders = []
    for _ in range(20):
        order = Order(
            user_id=fake.random_element(elements=[user.id for user in users]),
            menu_item_id=fake.random_element(elements=[menu_item.id for menu_item in menu_items]),
            quantity=fake.random_int(min=1, max=5),
            order_date=fake.date_time_this_year()
        )
        orders.append(order)

    db.session.add_all(orders)
    db.session.commit()

    print("Seeding done!")

