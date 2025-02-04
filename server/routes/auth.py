from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from app import db  # Ensure this points to the correct app instance
from models import User  # Ensure the User model is correctly imported

# Create Blueprint
auth = Blueprint('auth', __name__)

# Test Route
@auth.route("/", methods=["GET"])
def test():
    """Test route to verify that the auth blueprint is registered."""
    return jsonify({"message": "Auth blueprint is working!"}), 200


# Signup Route
@auth.route("/signup", methods=["POST"])
def signup():
    """Route to register a new user."""
    try:
        data = request.get_json()

        # Validate request payload
        if not data or "email" not in data or "password" not in data or "name" not in data:
            return jsonify({"error": "Name, email, and password are required"}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user:
            return jsonify({"error": "Email already in use"}), 400

        # Hash the password
        hashed_password = generate_password_hash(data["password"], method="sha256")

        # Create new user
        new_user = User(
            name=data["name"],
            email=data["email"],
            password=hashed_password,
            role=data.get("role", "guest"),  # Default role is guest
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Login Route
@auth.route("/login", methods=["POST"])
def login():
    """Route to authenticate a user and provide a JWT token."""
    try:
        data = request.get_json()

        # Validate request payload
        if not data or "email" not in data or "password" not in data:
            return jsonify({"error": "Email and password are required"}), 400

        # Find user by email
        user = User.query.filter_by(email=data["email"]).first()
        if not user or not check_password_hash(user.password, data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Create JWT access token
        access_token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify({"access_token": access_token, "message": "Login successful!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Protected Route Example
@auth.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    """Route to fetch the profile of the currently authenticated user."""
    try:
        current_user = get_jwt_identity()  # Get user identity from the JWT token
        return jsonify({"message": "Welcome!", "user": current_user}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
