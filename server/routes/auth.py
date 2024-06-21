from flask_restful import Resource
from flask import request, jsonify
from flask_jwt_extended import create_access_token
from models import Player
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class SignupApi(Resource):
    def post(self):
        body = request.get_json()
        username = body.get('username')
        email = body.get('email')
        password = body.get('password')
        
        if Player.query.filter_by(username=username).first():
            return {"error": "Username already exists"}, 409

        if Player.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 409
        
        hashed_password = generate_password_hash(password, method='sha256')

        new_player = Player(username=username, email=email, password=hashed_password)
        db.session.add(new_player)
        db.session.commit()

        access_token = create_access_token(identity=new_player.id)
        return {'access_token': access_token}, 201

class LoginApi(Resource):
    def post(self):
        body = request.get_json()
        email = body.get('email')
        password = body.get('password')
        player = Player.query.filter_by(email=email).first()

        if not player or not check_password_hash(player.password, password):
            return {"error": "Wrong email or password"}, 401

        access_token = create_access_token(identity=player.id)
        return {'access_token': access_token}, 200