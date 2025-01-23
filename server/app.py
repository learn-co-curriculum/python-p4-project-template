#!/usr/bin/env python3

# library imports
from flask import request, abort, make_response, session
from flask_restful import Resource

# local imports
from config import app, db, api
from models import User, Exercise, RoutineItem, db

class Register(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return {"error": "All fields are required"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already in use"}, 400

        new_user = User(name=name, email=email)
        new_user.password = password

        try:
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User registered successfully"}, 201
        except Exception as e:
            db.session.rollback()
            return {"error": "An unexpected error occurred. Please try again."}, 500



class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        user = User.query.filter_by(email=email).first()

        if user and user.verify_password(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(only=('id','email','name')), 200)
        else:
            return {"error": "Invalid email or password"}, 401




class Logout(Resource):
    def post(self):
        if 'user_id' in session:
            session.pop('user_id', None)
            return {"message": "Logged out successfully"}, 200
        else:
            return {"error": "No user is currently logged in"}, 400



class Account(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "User not logged in"}, 401

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        return make_response({
            "name": user.name,
            "email": user.email
        }, 200)

    def put(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "User not logged in"}, 401

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = data['password']  

        try:
            db.session.commit()
            return make_response({"message": "Account updated successfully"}, 200)
        except Exception as e:
            return make_response({"error": "Could not update account"}, 500)

class RoutineItems(Resource):
    ## TODO: add validation. either with @before_request or to each method
        
    def get(self):
        routine = [routine.to_dict() for routine in RoutineItem.query.all()]
        return make_response(routine, 200)
    
    def post(self):
        data = request.get_json()
        try:
            new_record = RoutineItem(
                user_id = data['user_id'],
                exercise_id = data['exercise_id'],
                initial_weight = data['initial_weight'],
                current_weight = data['current_weight'],
                initial_reps = data['initial_reps'],
                current_reps = data['current_reps'],
                initial_sets = data['initial_sets'],
                current_sets = data['current_sets'],
                priority = data['priority'],
                day_of_the_week = data['day_of_the_week']
            )
        except ValueError as e:
            abort(422, e.args[0])
        
        db.session.add(new_record)
        db.session.commit()
        return make_response(new_record.to_dict(), 201)
    


class RoutineItemByID(Resource):
    ## TODO: add validation. either with @before_request or to each method
    
    @classmethod
    def find_model_by_id(cls, id):
        #return RoutineItem.query.get_or_404(id)
        model = RoutineItem.query.filter_by(id=id).first()
        if model:
            return model
        else:
            return False

    def get(self, id):
        model = self.__class__.find_model_by_id(id)
        if not model:
            return make_response({"error": f"Model ID: {id} not found"}, 404)
        return make_response(model.to_dict(), 200)
    
    def patch(self, id):
        model = self.__class__.find_model_by_id(id)
        if not model:
            return make_response({"error": f"Model ID: {id} not found"}, 404)
        data = request.get_json()
        try:
            for attr,value in data.items():
                setattr(model, attr, value)
        except ValueError as e:
            return make_response({"error": e.args}, 422)
        db.session.commit()
        return make_response(model.to_dict(), 202)
    
    def delete(self, id):
        model = self.__class__.find_model_by_id(id)
        if not model:
            return make_response({"error": f"Model ID: {id} not found"}, 404)
        db.session.delete(model)
        db.session.commit()
        return make_response("", 204)


class Exercises(Resource):
    
    def get(self):
        exercises = [exercise.to_dict(rules=('-routines',)) for exercise in Exercise.query.all()]
        return make_response(exercises, 200)
    

api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')
api.add_resource(RoutineItems, '/api/routines')
api.add_resource(RoutineItemByID, '/api/routines/<int:id>')
api.add_resource(Account, '/api/account')
api.add_resource(Exercises, '/api/exercises')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

