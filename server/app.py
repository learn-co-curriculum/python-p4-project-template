from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Product, Transaction, User
import os
from datetime import datetime

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

@app.route('/')
def index():
    return {"Final Challenge": "Grp 5"}

@app.route('/products', methods=['GET', 'POST'])
def products():
    if request.method == 'GET':
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products])
    elif request.method == 'POST':
        data = request.get_json()
        new_product = Product(
            name=data['name'],
            sku=data['sku'],
            description=data['description'],
            quantity=data['quantity'],
            price=data['price'],
            supplier_id=data['supplier_id']
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201

@app.route('/low_stock', methods=['GET'])
def low_stock():
    threshold = request.args.get('threshold', type=int)
    if threshold is None:
        return {'error': 'Threshold query parameter is required'}, 400
    low_stock_products = Product.find_low_stock(threshold)
    return jsonify([product.to_dict() for product in low_stock_products])

@app.route('/transactions', methods=['GET', 'POST'])
def transactions():
    if request.method == 'GET':
        transactions = Transaction.query.all()
        return jsonify([transaction.to_dict() for transaction in transactions])
    elif request.method == 'POST':
        data = request.get_json()
        new_transaction = Transaction(
            user_id=data['user_id'],
            product_id=data['product_id'],
            date=data.get('date', datetime.utcnow()),
            quantity=data['quantity'],
            total_price=data['total_price'],
            type=data['type']
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify(new_transaction.to_dict()), 201

@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(
        email=data['email'],
        name=data['name'],
        companyName=data['companyName'],
        country=data['country'],
        city=data['city']
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.find_by_email_and_password(data['email'], data['password'])
    if user:
        return {"message": "Login successful"}
    else:
        return {'error': 'Invalid email or password'}, 400

if __name__ == '__main__':
    app.run(port=5555, debug=True)
