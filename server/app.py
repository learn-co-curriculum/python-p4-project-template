#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Product, Order, OrderItem

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'], gender=data['gender'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())

if __name__ == '__main__':
    app.run(debug=True)
