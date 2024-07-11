#!/usr/bin/env python3

# Standard library imports
from flask import Flask, request, make_response
from flask_restful import Resource, Api
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import timedelta
import random, os

# from config import app, db, api
# Add your model imports
from models import db, User, Event, Registration

# Instantiate app, set attributes
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")


# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.json.compact = False

app.config["JWT_SECRET_KEY"] = "dcvbgftyukns6qad"+str(random.randint(1,10000000000))
app.config["SECRET_KEY"] = "s6hjx0an2mzoret"+str(random.randint(1,1000000000))
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['ACCESS_TOKEN_EXPIRES'] = False


migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class Home(Resource):
    def get(self):
        response_body = {
            'message': 'Welcome to our Events Management Application'
        }
        return make_response(response_body, 200)

api.add_resource(Home, '/')

class Login(Resource):
    def post(self):
        email = request.json.get('email', None)
        password = request.json.get('password_hash', None)

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            access_token = create_access_token(identity=user.id)
        
            response_body = {
                'access_token' : f'{access_token}'
                }
            return make_response(response_body, 200)
        
        else:
            response_body = {
                'Access Denied' : 'Username or Password incorrect'
                }
            return make_response(response_body, 401)
    
api.add_resource(Login, '/login')

class Current_User(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if current_user:
            current_user_dict = current_user.to_dict()
            return make_response(current_user_dict, 200)
        else:
            response_body = {
                'message': 'User not current user'
            }
            return make_response(response_body, 404)
        
api.add_resource(Current_User, '/current_user')

BLACKLIST =set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

class Logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        BLACKLIST.add(jti)
        
        response_body = {
            'message' : 'Successfully logged out'
        }

        return make_response(response_body, 200)

api.add_resource(Logout, '/logout')

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
            
        response = make_response(users, 200)
            
        return response
    def post(self):
        try:
            new_user = User (
                name = request.json['name'],
                username = request.json['username'],
                email = request.json['email'],
                password_hash= bcrypt.generate_password_hash(request.json['password_hash']).decode('utf-8'),
            )


            db.session.add(new_user)
            db.session.commit()

            user_dict = new_user.to_dict()

            return make_response(user_dict, 201)
        
        except ValueError:
            response_body = {
                'error': 'Could not create user'
            }
            return make_response(response_body, 400)

api.add_resource(Users, '/users')

class UsersByID(Resource):
    def get(self,id):
         user = User.query.filter_by(id=id).first()
         if user:
            user_dict = user.to_dict()
            
            return make_response(user_dict, 200)
         
         else:
            response_body = {
                'message' : 'User does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()

            response_body = {
                'message': 'User deleted Successfully'
            }
            return make_response(response_body, 200)
        else:
            response_body = {
                'message' : 'User does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def patch(self,id):
         user = User.query.filter_by(id=id).first()
         if user:
            try:
                for attr in request.json:
                    setattr(user, attr, request.json.get(attr))

                db.session.add(user)
                db.session.commit()

                user_dict = user.to_dict
                return make_response(user_dict, 200)
            
            except ValueError:
                response_body = {
                    'error': 'error occured'
                }
         else:
            response_body = {
                'message' : 'User you are trying to Edit does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
         
api.add_resource(UsersByID, '/users/<int:id>')

class Events(Resource):
    def get(self):
        events = [event.to_dict() for event in Event.query.all()]

        response = make_response(events, 200)
        return response
    def post():
        try:
            new_event = Event(
                title = request.json['title'],
                description = request.json['description'],
                date = request.json['date'],
                location = request.json['location'],
                no_of_registrations = request.json['no_of_registrations'],
                creator_id = request.json['creator_id']
            )

            db.session.add(new_event)
            db.session.commit()

            event_dict = new_event.to_dict()
            response = make_response(event_dict, 201)

            return response
        except ValueError:
            response_body = {
                'error': 'error occurred'
            }
            return make_response(response_body, 400)
        
api.add_resource(Events, '/events')
        
class EventsByID(Resource):
    def get(self,id):
        event = Event.query.filter_by(id=id).first()
        if event:
            event_dict = event.to_dict()
            return make_response(event_dict, 200)
        else:
            response_body = {
                'message' : 'Event does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def delete(self, id):
        event = Event.query.filter_by(id=id).first()
        if event:
            db.session.delete(event)
            db.session.commit()

            response_body = {
                'message': 'Event deleted Successfully'
            }
            return make_response(response_body, 200)
        else:
            response_body = {
                'message' : 'Event does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def patch(self,id):
         event = Event.query.filter_by(id=id).first()
         if event:
            try:
                for attr in request.json:
                    setattr(event, attr, request.json.get(attr))

                db.session.add(event)
                db.session.commit()

                event_dict = event.to_dict
                return make_response(event_dict, 200)
            
            except ValueError:
                response_body = {
                    'error': 'error occured'
                }
         else:
            response_body = {
                'message' : 'Event you are trying to Edit does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
         
api.add_resource(EventsByID, '/events/<int:id>')

class Registrations(Resource):
    def get(self):
        registrations = [registration.to_dict() for registration in Registration.query.all()]

        response = make_response(registrations, 200)
        return response
    def post():
        try:
            new_registration = Registration(
                registered_at = request.json['registered_at'],
                review = request.json['review'],
                event_id = request.json['event_id']
            )
            
            db.session.add(new_registration)
            db.session.commit()

            registration_dict = new_registration.to_dict()
            response = make_response(registration_dict, 201)

            return response
        except ValueError:
            response_body = {
                'error': 'error occurred'
            }
            return make_response(response_body, 400)
        
api.add_resource(Registrations, '/registrations')
        
class RegistrationsByID(Resource):
    def get(self,id):
        registration = Registration.query.filter_by(id=id).first()
        if registration:
            registration_dict = registration.to_dict()
            return make_response(registration_dict, 200)
        else:
            response_body = {
                'message' : 'Registration does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def delete(self, id):
        registration = Registration.query.filter_by(id=id).first()
        if registration:
            db.session.delete(registration)
            db.session.commit()

            response_body = {
                'message': 'Registration deleted Successfully'
            }
            return make_response(response_body, 200)
        else:
            response_body = {
                'message' : 'Registration does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
        
    def patch(self,id):
         registration = Registration.query.filter_by(id=id).first()
         if registration:
            try:
                for attr in request.json:
                    setattr(registration, attr, request.json.get(attr))

                db.session.add(registration)
                db.session.commit()

                registration_dict = registration.to_dict
                return make_response(registration_dict, 200)
            
            except ValueError:
                response_body = {
                    'error': 'error occured'
                }
         else:
            response_body = {
                'message' : 'Event you are trying to Edit does not exist! Check the id again.'
            }

            return make_response(response_body, 404)
         
api.add_resource(RegistrationsByID, '/registrations/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

