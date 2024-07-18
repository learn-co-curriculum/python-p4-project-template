#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource


# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Destination, Review


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
    def post(self):
        data = request.get_json()
        user = User(username=data['username'], email=data['email'], password=data['password'])
        db.session.add(user)
        db.session.commit()
        return make_response(user.to_dict(), 201)
    
    def delete(self, id):
        user = User.query.filter_by(id= id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(user.to_dict(), 200)
        else:
            return make_response({'error': 'User not found'}, 404)
        
    def patch(id):
        user = User.query.filter_by(id= id).first()
        if user:
            for attr in request.json:
                setattr(user, attr, request.json[attr])
            db.session.add(user)
            db.session.commit()
        else:
            return make_response({'error': 'User not found'}, 404)
        
class UserByID(Resource):   
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        
        if user:
            return make_response(user.to_dict(), 200)
        
        return make_response({'error': 'User not found'}, 404)
        
class Destinations(Resource):
    
    def get(self):
        destinations = [destination.to_dict() for destination in Destination.query.all()]
        return make_response(destinations, 200)
    
    def post(self):
        data = request.json
        destination = Destination(name=data['name'], location=data['location'], description=data['description'], image=data['image'])
        db.session.add(destination)
        db.session.commit()
        return make_response(destination.to_dict(), 201)
    
    def delete(self, id):
        destination = Destination.query.filter_by(id= id).first()
        if destination:
            db.session.delete(destination)
            db.session.commit()
            return make_response(destination.to_dict(), 200)
        else:
            return make_response({'error': 'Destination not found'}, 404)
        
    def patch(self, id):
        destination = Destination.query.filter_by(id=id).first()
        for attr in request.json:
            setattr(destination, attr, request.json[attr])
            
        db.session.add(destination)
        db.session.commit()
        return make_response(destination.to_dict(), 200)
    
class DestinationByID(Resource):
    
    def get(self,id):
        destination = Destination.query.filter_by(id=id).first()
        
        if destination:
            return make_response(destination.to_dict(), 200)
        
        return make_response({'error': 'Destination not found'}, 404)
    
class Reviews(Resource):
    
    def get(self):
        reviews = [review.to_dict() for review in Review.query.all()]
        return make_response(reviews, 200)
    
    def post(self):
        data = request.json
        review = Review(user_id=data['user_id'], destination_id=data['destination_id'], rating=data['rating'], comment=data['comment'])
        db.session.add(review)
        db.session.commit()
        return make_response(review.to_dict(), 201)
    
    def delete(self, id):
        review = Review.query.filter_by(id= id).first()
        if review:
            db.session.delete(review)
            db.session.commit()
            return make_response(review.to_dict(), 200)
        else:
            return make_response({'error': 'Review not found'}, 404)
        
    def patch(self, id):
        review = Review.query.filter_by(id=id).first()
        for attr in request.json:
            setattr(review, attr, request.json[attr])
            
        db.session.add(review)
        db.session.commit()
        return make_response(review.to_dict(), 200)
     
class ReviewByID(Resource):
    
    def get(self, id):
        review = Review.query.filter_by(id=id).first()
        
        if review:
            return make_response(review.to_dict(), 200)
        
        return make_response({'error': 'Review not found'}, 404)
    
api.add_resource(Users, '/users')
api.add_resource(Destinations, '/destinations')
api.add_resource(Reviews, '/reviews')
api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(DestinationByID, '/destinations/<int:id>')
api.add_resource(ReviewByID, '/reviews/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

