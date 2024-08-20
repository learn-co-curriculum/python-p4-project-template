#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Transaction, User, FriendRequest, friendship_table

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        # FriendRequest.query.delete()
        
        Transaction.query.delete()
        # User.query.delete()
        
        # # Create users
        # users = []
        # for _ in range(10):
        #     user = User(username=fake.unique.user_name())
        #     user.password = "password"  # Set a default password
        #     users.append(user)
        
        # db.session.add_all(users)
        # db.session.commit()

        # # Create transactions
        # transactions = []
        # for _ in range(50):
        #     sender = rc(users)
        #     receiver = rc(users)
        #     while receiver == sender:
        #         receiver = rc(users)
            
        #     transaction = Transaction(
        #         requestor=sender.id,
        #         requestee=receiver.id,
        #         amount=randint(1, 1000),
        #         year=randint(2000, 2023)  # Random year between 2000 and 2023
        #     )
        #     transactions.append(transaction)
        
        # db.session.add_all(transactions)
        db.session.commit()

        print("Seed completed!")
