#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
import re

# Local imports
from config import app, db, api, bcrypt

# Add your model imports
from models import User

#Instantiate bcrypt
bcrypt.init_app(app)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

### REGISTRATION VIEW
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate username
    if not re.match(r'^\w+$', username):
        return jsonify({"error": "Username must contain only letters, numbers, and underscores."}), 400

    # Validate email
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return jsonify({"error": "Invalid email address."}), 400

    # Validate password
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long."}), 400

    # Check if the username or email already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({"error": "Username or email already exists."}), 400

    # Create a new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

### LOGIN VIEW
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find the user by username
    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid username or password."}), 401

    return jsonify({"message": "Login successful!"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables for our data models
    app.run(debug=True)




if __name__ == '__main__':
    app.run(port=5555, debug=True)

