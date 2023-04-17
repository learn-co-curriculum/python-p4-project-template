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

    
api.add_resource(Farmers, '/farmers')


class OrdersById(Resource):
    def get(self, id):
        o = Order.query.filter_by(id = id).first()
        if o == None:
            return make_response({'error': 'no Farmers'}, 404)
        return make_response(o.to_dict(), 200)
    def post (self,id):
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
        
api.add_resource(OrdersById, '/orders/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
