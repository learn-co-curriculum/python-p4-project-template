#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
# from faker import Faker

# Local imports
from app import app
from models import db, Customer, Farmer, Order

if __name__ == '__main__':
    # fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

# fake = Faker()

def make_this():
    Customer.query.delete()
    Farmer.query.delete()
    Order.query.delete()
    c1 = Customer(name = 'Regan', address = '578 Circle ave', payment_method = 3314886500998850)
    c2 = Customer(name = 'Matthew', address = '887 Flair drive', payment_method = 4234672498530336)
    c3 = Customer(name = 'Connor', address = '114 Port lane', payment_method = 9938293875109023)
    c4 = Customer(name = 'Katelynn', address = '993 Steve crib', payment_method = 1152273097364938)

    c = [c1,c2,c3,c4]


    f1 = Farmer(name = 'Dwight', location = 'Shrute Farms, Scranton')
    f2 = Farmer(name = 'Steve Austin', location = 'Broken Skull Ranch, Nevada')
    f3 = Farmer(name = 'Randy', location = 'South Park, Colorado')

    f = [f1,f2,f3]

    o1 = Order(details = 'Beets, Onions, Carrots', customer = c1, farmer = f1)
    o2 = Order(details = 'Beer, Chickens, Pork', customer = c2, farmer = f2)
    o3 = Order(details = 'Pork', customer = c4, farmer = f2)
    o4 = Order(details = 'Beets, Knuckle Sandwich', customer = c2, farmer = f1)
    o5 = Order(details = 'Sativa, Indica', customer = c3, farmer = f3)

    o= [o1,o2,o3,o4,o5]

    db.session.add_all(c)
    db.session.add_all(f)
    db.session.add_all(o)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        make_this()