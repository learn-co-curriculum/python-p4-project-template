#!/usr/bin/env python3

# Standard library imports
# from random import randint, choice as rc

# Remote library imports
# from faker import Faker

# Local imports
from app import app
from models import db,Product
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
vegetables = [
    {
        "name": "Sukumawiki",
        "image": "https://images.pexels.com/photos/9465761/pexels-photo-9465761.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 11.50,
        "type": 'Vegetable'
    },
    {
        "name": "Cabbage",
        "image": "https://images.pexels.com/photos/134877/pexels-photo-134877.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 14.50,
        "type": 'Vegetable'
    },
    {
        "name": "Tomato",
        "image": "https://images.pexels.com/photos/3943197/pexels-photo-3943197.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 7.00,
        "type": 'Vegetable'
    },
    {
        "name": "Cucumber",
        "image": "https://images.pexels.com/photos/4203056/pexels-photo-4203056.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 5.50,
        "type": 'Vegetable'
    },
    {
        "name": "Carrot",
        "image": "https://images.pexels.com/photos/162783/carrot-kitchen-rustic-bunch-162783.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 4.00,
        "type": 'Vegetable'
    },
    {
        "name": "Potato",
        "image": "https://images.pexels.com/photos/4110246/pexels-photo-4110246.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 6.00,
        "type": 'Vegetable'
    },
    {
        "name": "Spinach",
        "image": "https://images.pexels.com/photos/3951328/pexels-photo-3951328.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 8.00,
        "type": 'Vegetable'
    },
    {
        "name": "Bell Pepper",
        "image": "https://images.pexels.com/photos/1268101/pexels-photo-1268101.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 12.00,
        "type": 'Vegetable'
    },
    {
        "name": "Eggplant",
        "image": "https://images.pexels.com/photos/3648668/pexels-photo-3648668.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 10.00,
        "type": 'Vegetable'
    },
    {
        "name": "Onion",
        "image": "https://images.pexels.com/photos/1309677/pexels-photo-1309677.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 3.50,
        "type": 'Vegetable'
    },
    {
        "name": "Garlic",
        "image": "https://images.pexels.com/photos/41957/garlic-garlic-cloves-food-spice-41957.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 9.00,
        "type": 'Vegetable'
    }
]

# Sample Fruits
vegetables = [
    {
        "name": "Sukumawiki",
        "image": "https://images.pexels.com/photos/9465761/pexels-photo-9465761.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 11.50,
        "type": 'Vegetable'
    },
    {
        "name": "Cabbage",
        "image": "https://images.pexels.com/photos/134877/pexels-photo-134877.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 14.50,
        "type": 'Vegetable'
    },
    {
        "name": "Tomato",
        "image": "https://images.pexels.com/photos/3943197/pexels-photo-3943197.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 7.00,
        "type": 'Vegetable'
    },
    {
        "name": "Cucumber",
        "image": "https://images.pexels.com/photos/4203056/pexels-photo-4203056.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 5.50,
        "type": 'Vegetable'
    },
    {
        "name": "Carrot",
        "image": "https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 4.00,
        "type": 'Vegetable'
    },
    {
        "name": "Potato",
        "image": "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 6.00,
        "type": 'Vegetable'
    },
    {
        "name": "Spinach",
        "image": "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 8.00,
        "type": 'Vegetable'
    },
    {
        "name": "Bell Pepper",
        "image": "https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 12.00,
        "type": 'Vegetable'
    },
    {
        "name": "Eggplant",
        "image": "https://images.pexels.com/photos/6316542/pexels-photo-6316542.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 10.00,
        "type": 'Vegetable'
    },
    {
        "name": "Onion",
        "image": "https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 3.50,
        "type": 'Vegetable'
    },
    {
        "name": "Garlic",
        "image": "https://images.pexels.com/photos/630766/garlic-kitchen-food-fresh-630766.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 9.00,
        "type": 'Vegetable'
    }
]

fruits = [
    {
        "name": "Apple",
        "image": "https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 2.50,
        "type": 'Fruit'
    },
    {
        "name": "Banana",
        "image": "https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 1.80,
        "type": 'Fruit'
    },
    {
        "name": "Orange",
        "image": "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3JhbmdlfGVufDB8fDB8fHww",
        "price": 3.20,
        "type": 'Fruit'
    },
    {
        "name": "Grapes",
        "image": "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 24.50,
        "type": 'Fruit'
    },
    {
        "name": "Strawberry",
        "image": "https://images.pexels.com/photos/6944172/pexels-photo-6944172.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 5.00,
        "type": 'Fruit'
    },
    {
        "name": "Watermelon",
        "image": "https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 6.00,
        "type": 'Fruit'
    },
    {
        "name": "Mango",
        "image": "https://images.pexels.com/photos/2363345/pexels-photo-2363345.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 6.00,
        "type": 'Fruit'
    },
    {
        "name": "Pineapple",
        "image": "https://images.pexels.com/photos/137119/pexels-photo-137119.jpeg?auto=compress&cs=tinysrgb&w=600",
        "price": 6.00,
        "type": 'Fruit'
    }
]

# Sample Dairy Products
dairy_products = [
    {
        "name": "Milk",
        "image": "https://images.unsplash.com/photo-1585083969600-495ee7e3604b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWlsayUyMGJvdHRsZXxlbnwwfHwwfHx8MA%3D%3D",
        "price": 22.00,
        "type": 'Dairy'
    },
    {
        "name": "Cheese",
        "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlfGVufDB8fDB8fHww",
        "price": 13.50,
        "type": 'Dairy'
    },
    {
        "name": "Yogurt",
        "image": "https://images.unsplash.com/photo-1584278433313-562a1bc0aa6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHlvZ2h1cnR8ZW58MHx8MHx8fDA%3D",
        "price": 20.80,
        "type": 'Dairy'
    },
    {
        "name": "Butter",
        "image": "https://images.unsplash.com/photo-1603596310923-dbb12732f9c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJ1dHRlcnxlbnwwfHwwfHx8MA%3D%3D",
        "price": 29.00,
        "type": 'Dairy'
    }
    
]


def add_products(products):
    with app.app_context():
        for product_data in products:
            product = Product.query.filter_by(name=product_data["name"]).first()
            if product is None:
                new_product = Product(
                    name=product_data["name"],
                    image=product_data["image"],
                    price=product_data["price"],
                    type=product_data["type"]
                )
                db.session.add(new_product)


        db.session.commit()


# Seed vegetables, fruits, and dairy products
add_products(vegetables)
add_products(fruits)
add_products(dairy_products)

# Commit the changes to the database
with app.app_context():
    db.session.commit()
