from flask import Blueprint, request, jsonify
from app.models import db, User  
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': {'id': user.id, 'username': user.username}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        return jsonify({'token': token, 'user': {'id': user.id, 'username': user.username}})
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/check_session', methods=['GET'])
@jwt_required()
def check_session():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({'id': user.id, 'username': user.username})