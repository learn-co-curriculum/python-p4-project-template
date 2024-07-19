#!/usr/bin/env python3

from app import app
from faker import Faker
import datetime
from models import db, Product, Supplier, Order, Transaction, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

with app.app_context():
    fake = Faker()
    print("Starting seed...")
    
    # Delete all records/rows in the tables
    Product.query.delete()
    Supplier.query.delete()
    Transaction.query.delete()
    Order.query.delete()
    User.query.delete()
    
    # Seed Suppliers
    suppliers = [
        Supplier(name=fake.company(), description=fake.catch_phrase(), date=datetime.datetime.now()),
        Supplier(name=fake.company(), description=fake.catch_phrase(), date=datetime.datetime.now() - datetime.timedelta(days=30)),
        Supplier(name=fake.company(), description=fake.catch_phrase(), date=datetime.datetime.now() - datetime.timedelta(days=60))
    ]
    db.session.add_all(suppliers)
    db.session.commit()

    # Seed Products
    products = [
        Product(name=fake.word(), description=fake.sentence(), price=fake.random_number(digits=4, fix_len=True), supplier_id=suppliers[0].id, date=datetime.datetime.now()),
        Product(name=fake.word(), description=fake.sentence(), price=fake.random_number(digits=4, fix_len=True), supplier_id=suppliers[1].id, date=datetime.datetime.now() - datetime.timedelta(days=30)),
        Product(name=fake.word(), description=fake.sentence(), price=fake.random_number(digits=4, fix_len=True), supplier_id=suppliers[2].id, date=datetime.datetime.now() - datetime.timedelta(days=60))
    ]
    db.session.add_all(products)
    db.session.commit()
    
    # Seed Orders
    orders = [
        Order(description=fake.sentence(), quantity=fake.random_int(min=1, max=100), price=fake.random_number(digits=4, fix_len=True), date_received=datetime.datetime.now(), product_id=products[0].id),
        Order(description=fake.sentence(), quantity=fake.random_int(min=1, max=100), price=fake.random_number(digits=4, fix_len=True), date_received=datetime.datetime.now() - datetime.timedelta(days=30), product_id=products[1].id),
        Order(description=fake.sentence(), quantity=fake.random_int(min=1, max=100), price=fake.random_number(digits=4, fix_len=True), date_received=datetime.datetime.now() - datetime.timedelta(days=60), product_id=products[2].id)
    ]
    db.session.add_all(orders)
    db.session.commit()

    # Seed Transactions
    transactions = [
        Transaction(quantity=fake.random_int(min=1, max=100), product_id=products[0].id, date=datetime.datetime.now()),
        Transaction(quantity=fake.random_int(min=1, max=100), product_id=products[1].id, date=datetime.datetime.now() - datetime.timedelta(days=30)),
        Transaction(quantity=fake.random_int(min=1, max=100), product_id=products[2].id, date=datetime.datetime.now() - datetime.timedelta(days=60))
    ]
    db.session.add_all(transactions)
    db.session.commit()

    # Seed Users
    users = [
        User(name=fake.name(), email=fake.email(), role="admin", password=bcrypt.generate_password_hash(fake.password()).decode('utf-8')),
        User(name=fake.name(), email=fake.email(), role="supervisor", password=bcrypt.generate_password_hash(fake.password()).decode('utf-8'))
    ]
    db.session.add_all(users)
    db.session.commit()

    print("Database seeded successfully!")