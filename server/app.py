#!/usr/bin/env python3
from models import db, Product, Supplier, Transaction, Order
from flask_migrate import Migrate
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
#incase you run and there is an error you can remove import bcrypt below
from flask_bcrypt import Bcrypt

import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

CORS(app) # Allow requests from all origins

migrate = Migrate(app, db)

db.init_app(app)

from models import Supplier, Product, Transaction, Order

@app.route('/supplier', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([supplier.__repr__() for supplier in suppliers])
api = Api(app)

@app.route('/')
def index():
    return '<h1>Phase 4 Final Challenge</h1>'

class ProductResource(Resource):
    def get(self, product_id=None):
        if product_id:
            product = Product.query.get(product_id)
            if product:
                return jsonify(product.to_dict())
            return {'error': 'Product not found'}, 404
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products])

    def post(self):
        data = request.get_json()
        try:
            new_product = Product(
                name=data["name"],
                description=data["description"],
                price=data["price"],
                supplier_id=data["supplier_id"],
                date=data["date"]
            )

            db.session.add(new_product)
            db.session.commit()
            return jsonify(new_product.to_dict()), 201
        except Exception as e:
            return {'error': str(e)}, 400

class SupplierResource(Resource):
    def get(self, supplier_id=None):
        if supplier_id:
            supplier = Supplier.query.get(supplier_id)
            if supplier:
                return jsonify(supplier.to_dict())
            return {'error': "Supplier not found!"}, 404
        suppliers = Supplier.query.all()
        return jsonify([supplier.to_dict() for supplier in suppliers])

    def post(self):
        data = request.get_json()
        try:
            new_supplier = Supplier(
                name=data["name"],
                description=data["description"],
                date=data["date"]
            )

            db.session.add(new_supplier)
            db.session.commit()
            return jsonify(new_supplier.to_dict()), 201
        except Exception as e:
            return {'error': str(e)}, 400

class TransactionResource(Resource):
    def get(self, transaction_id=None):
        if transaction_id:
            transaction = Transaction.query.get(transaction_id)
            if transaction:
                return jsonify(transaction.to_dict())
            return {'error': "Transaction not found!"}, 404
        transactions = Transaction.query.all()
        return jsonify([transaction.to_dict() for transaction in transactions])

@app.route('/transaction/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404
    return jsonify(transaction.__repr__())

@app.route('/transaction', methods=['POST'])
def create_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        quantity=data['quantity'],
        product_id=data['product_id'],
        created_at=datetime.datetime.utcnow()
    )
    db.session.add(new_transaction)
    try:
        db.session.commit()
        return jsonify({'message': 'Transaction created successfully'}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/transaction/<int:id>', methods=['PUT'])
def update_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404
    data = request.get_json()
    transaction.quantity = data['quantity']
    transaction.product_id = data['product_id']
    try:
        db.session.commit()
        return jsonify({'message': 'Transaction updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/transaction/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404
    db.session.delete(transaction)
    try:
        db.session.commit()
        return jsonify({'message': 'Transaction deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400
    
@app.route('/order', methods=['GET'])
def get_transactions():
    order = Order.query.all()
    return jsonify([order.__repr__() for order in orders])

@app.route('/order/<int:id>', methods=['GET'])
def get_transaction(id):
    order = Order.query.get(id)
    if not Order:
        return jsonify({'message': 'Order unavailable'}), 404
    return jsonify(Order.__repr__())

@app.route('/order', methods=['POST'])
def create_order():
    data = request.get_json()
    new_order = Order(
        quantity=data['quantity'],
        product_id=data['product_id'],
        date_received=datetime.datetime.utcnow()
    )
    db.session.add(new_order)
    try:
        db.session.commit()
        return jsonify({'message': 'Order done successfully'}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/order/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'message': 'order not found'}), 404
    data = request.get_json()
    order.quantity = data['quantity']
    order.product_id = data['product_id']
    try:
        db.session.commit()
        return jsonify({'message': 'Order updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

@app.route('/order/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'message': 'Order not found'}), 404
    db.session.delete(order)
    try:
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400
    def post(self):
        data = request.get_json()
        try:
            new_transaction = Transaction(
                quantity=data["quantity"],
                product_id=data["product_id"],
                date=data["date"]
            )

            db.session.add(new_transaction)
            db.session.commit()
            return jsonify(new_transaction.to_dict()), 201
        except Exception as e:
            return {'error': str(e)}, 400

class OrderResource(Resource):
    def get(self, order_id=None):
        if order_id:
            order = Order.query.get(order_id)
            if order:
                return jsonify(order.to_dict())
            return {'error': "Order not found!"}, 404
        orders = Order.query.all()
        return jsonify([order.to_dict() for order in orders])

    def post(self):
        data = request.get_json()
        try:
            new_order = Order(
                description=data["description"],
                quantity=data["quantity"],
                price=data["price"],
                product_id=data["product_id"],
                date_received=data["date_received"]
            )

            db.session.add(new_order)
            db.session.commit()
            return jsonify(new_order.to_dict()), 201
        except Exception as e:
            return {'error': str(e)}, 400
        
#you can comment this part out for users if it is not working if the db does not run    
##

api.add_resource(ProductResource, '/products', '/products/<int:product_id>')
api.add_resource(SupplierResource, '/suppliers', '/suppliers/<int:supplier_id>')
api.add_resource(TransactionResource, '/transactions', '/transactions/<int:transaction_id>')
api.add_resource(OrderResource, '/orders', '/orders/<int:order_id>')
#you can comment this part out for users if it is not working if the db does not run
#api.add_resource(OrderResource, '/users', '/users/<int:users_id>')

if __name__ == '__main__':
    app.run(debug=True)

    app.run(port=5555, debug=True)