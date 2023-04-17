#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import Farmer, Order, Customer

# Views go here!
class Farmers(Resource):
    def get(self):
        f_list = [f.to_dict() for f in Farmer.query.all()]
        if len(f_list) == 0:
            return make_response({'error': 'no Farmers'}, 404)
        return make_response(f_list, 200)
    
    def post (self):
        data = request.get_json()
        newFarmer = Farmer(
            name= data["name"],
            location = data["location"],
            )
        try:
            db.session.add(newFarmer)
            db.session.commit()
            return make_response (newFarmer.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)}'}, 422)


api.add_resource(Farmers, '/farmers')

class Customers(Resource):
    def get(self):
        c_list = [c.to_dict() for c in Customer.query.all()]
        if len(c_list) == 0:
            return make_response({'error': 'no Customers'}, 404)
        return make_response(c_list, 200)
    
    def post (self):
        data = request.get_json()
        newCustomer = Customer(
            name = data["name"],
            address = data["address"],
            payment_method = data["payment_method"]
            )
        try:
            db.session.add(newCustomer)
            db.session.commit()
            return make_response (newCustomer.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)}'}, 422)

api.add_resource(Customers, '/customers')

class OrdersById(Resource):
    def get(self, id):
        o = Order.query.filter_by(id = id).first()
        if o == None:
            return make_response({'error': 'no Farmers'}, 404)
        return make_response(o.to_dict(), 200)
    def delete(self, id):
        o = Order.query.filter_by(id = id).first()
        db.session.delete(o)
        db.session.commit()
        response_body = {
            "deleted successfully": True,
            "message": "Order deleted successfully"
        }
        response = make_response(
            response_body,
            202
        )
        return response
    def patch(self, id):
        try:
            o = Order.query.filter_by(id = id).first()

            for attr in request.get_json():
                setattr(o, attr, request.get_json()[attr])
        except:
            response_body = {
                'error': 'no order'
            }
            return make_response( response_body, 404 )
        else:
            db.session.add(o)
            db.session.commit()
        
        return make_response(o.to_dict(), 200)
    
api.add_resource(OrdersById, '/orders/<int:id>')

class Orders(Resource):
    def get(self):
        o_list = [o.to_dict() for o in Order.query.all()]
        if len(o_list) == 0:
            return make_response({'error': 'no Orders'}, 404)
        return make_response(o_list, 200)
    def post (self):
        data = request.get_json()
        newOrder = Order(
            details= data["details"],
            customer_id = data["customer_id"], 
            farmer_id = data["farmer_id"],
            )
        try:
            db.session.add(newOrder)
            db.session.commit()
            return make_response (newOrder.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': f'{repr(e)}'}, 422)
        
api.add_resource(Orders, '/orders')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
