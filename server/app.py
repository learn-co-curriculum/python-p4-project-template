#!/usr/bin/env python3

# Standard library imports
import json
from datetime import datetime

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Local imports
from config import app, db, api
from models import User, Reading, Medication, Meal, Doctor, reading_meals
from schemas import UserSchema, ReadingSchema, MedicationSchema, MealSchema, DoctorSchema
from kenyan_foods import (
    KENYAN_FOODS,
    get_food_recommendations,
    get_diabetes_friendly_foods,
    get_foods_to_limit,
    get_kenyan_food_database
)
from glucose_predictor import (
    analyze_user_patterns,
    generate_predictive_alerts,
    get_meal_specific_predictions,
    get_food_impact_prediction,
    get_glucose_predictor
)
from gamification import (
    BADGES,
    DAILY_CHALLENGES,
    get_user_progress,
    check_badges,
    get_daily_challenges_status,
    get_gamification_system
)

# Initialize systems
food_db = get_kenyan_food_database()
predictor = get_glucose_predictor()
gamification = get_gamification_system()

# ---------------- Authentication ----------------
class Signup(Resource):
    def post(self):
        data = request.get_json()
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return {'error': 'Name, email, and password are required'}, 400
        if User.query.filter_by(email=data['email']).first():
            return {'error': 'User with this email already exists'}, 400
        try:
            user = User(name=data['name'], email=data['email'])
            user.password_hash = data['password']
            if 'diabetes_type' in data:
                user.diabetes_type = data['diabetes_type']
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=user.id)
            return {
                'user': user.to_dict(),
                'access_token': access_token,
                'education': education_for(user.diabetes_type),
                'advice': advice_for(user)
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data.get('email') or not data.get('password'):
            return {'error': 'Email and password are required'}, 400
        user = User.query.filter_by(email=data['email']).first()
        if user and user.authenticate(data['password']):
            access_token = create_access_token(identity=user.id)
            return {
                'user': user.to_dict(),
                'access_token': access_token,
                'education': education_for(user.diabetes_type),
                'advice': advice_for(user)
            }, 200
        else:
            return {'error': 'Invalid email or password'}, 401

class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            resp = user.to_dict()
            resp['education'] = education_for(user.diabetes_type)
            resp['advice'] = advice_for(user)
            return resp, 200
        else:
            return {'error': 'User not found'}, 404

@app.route('/')
def index():
    return '<h1>Diabetes Management API</h1>'
