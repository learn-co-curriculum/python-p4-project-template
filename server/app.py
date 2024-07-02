#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response,session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Recipe, UserRecipe

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>' 

class Users(Resource): 
    def get(self): 
        users = User.query.all() 
        users_list = [user.to_dict() for user in users] 
        return make_response(users_list,200)

api.add_resource(Users,"/users")

# Authentication 
class CheckSession(Resource): 
    def get(self): 
        user_id = session.get('user_id') 
        if user_id: 
            user = db.session.get(User, user_id) 
            if user: 
                return make_response(user.to_dict(),200) 
            return make_response({'error': 'Unauthorized: Must Login'},401)
api.add_resource(CheckSession, '/check_session') 

class SignUp(Resource): 
    def post(self): 
        params = request.json 
        username = params.get('username') 
        if User.query.filter_by(username=username).first(): 
            return make_response({'error': 'Username already exists'}, 400) 
        try: 
            user = User( 
                username = params.get('username'), 
                first_name = params.get('first_name'), 
                last_name = params.get('last_name'), 
                email = params.get('email')
            ) 
            user.password_hash = params.get('password') 
            db.session.add(user) 
            db.session.commit() 
            session['user_id'] = user.id 
            return make_response(user.to_dict(), 201) 
        except Exception as e: 
            return make_response({'error': str(e)}, 400) 
api.add_resource(SignUp, '/signup') 

class Login(Resource):
    def post(self):
        params = request.json
        user = User.query.filter_by(username=params.get('username')).first() 
        if not user: 
            return make_response({'error': 'Invalid username'}, 400) 
        if user.authenicate(params.get('password')): 
            session['user_id'] = user.id 
            return make_response(user.to_dict(), 200) 
        else: 
            return make_response({'error': 'Invalid password'}, 400) 
api.add_resource(Login, '/login') 

class Logout(Resource): 
    def delete(self): 
        session ['usder_id'] = None 
        return make_response({}, 204) 
api.add_resource(Logout, '/logout')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

