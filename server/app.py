#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Client

# Views go here!

@app.route('/')
def index():
     return '<h1>Project Server</h1>'  

class Clients(Resource): 
    def get(self) 
    clients = Client.query.all() 
    clients_list = [client.to_dict() for client in clients] 
    return clients_list, 200 

class ClientsById(Resource): 
    def get(self, id):
        client = Client.query.filter_by(id = id).first() 
        if client: 
            return client.to_dict(), 200 
        else: 
            return {"message": "Client not found"}, 404

class SignUp(Resource) 
    def post(self):  
        try:
            data = request.get_json() 
            client = Client(username = data['username'], email = data['email']) 
            client._password_hash = data['password'] 
            db.session.add(client) 
            db.session.commit() 
            return {'message': 'User created successfully'}, 201 
        except KeyError as k_error:
            return make_response({"error": "Missing required field: " + str(k_error)}, 422) 

class CheckSession(Resource):
    def get(self):

        client_id = session["client_id"]
        if client_id:
            client = Client.query.filter_by(id = client_id).first()
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "No session found"}, 401)

class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        client = Client.query.filter(Client.username == username).first()
        if client:
            try: 
                if client.authenticate(password):
                    session['client_id'] = client.id
                    return make_response(client.to_dict(), 200)
            except KeyError as k_error:
                return make_response({"error": "Missing required field: " + str(k_error)}, 422)
        
        return make_response({'error': '401 Unauthorized'}, 401) 

class Logout(Resource):
     def delete(self):
        if 'client_id' not in session or session['client_id'] is None:
            return make_response({"error": "No user logged in"}, 401)

        session['client_id'] = None
        
        return {}, 204  

api.add_resource(Clients, '/clients') 
api.add_resource(ClientsById, '/clients/<int:id>')
api.add_resource(Signup, '/signup', endpoint='signup') 
api.add_resource(CheckSession, '/check_session', endpoint='check_session') 
api.add_resource(Login, '/login', endpoint='login') 
api.add_resource(Logout, '/logout', endpoint='logout')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

