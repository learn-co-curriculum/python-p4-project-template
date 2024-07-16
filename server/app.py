from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import jwt_required, JWTManager, get_jwt_identity
from auth import auth_bp, bcrypt
from models import db, Customer, Product as ProductModel, Order, OrderItem, Review
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '9d1608035e013ed57370aff38dee'
app.json.compact = False

db.init_app(app)

# Initialize Migrate, JWT, and Bcrypt
migrate = Migrate(app, db)
jwt = JWTManager(app)
bcrypt.init_app(app)

# Register blueprint
app.register_blueprint(auth_bp)

# Instantiate REST API
api = Api(app)

with app.app_context():
    db.create_all()

@app.route('/')
@jwt_required()
def index():
    return '<h1>Project Server</h1>'


class ProductList(Resource):
    @jwt_required()

class Products(Resource):
    #@jwt_required

    def get(self):
        current_user_id = get_jwt_identity()
        type_filter = request.args.get('type')
        price_range = request.args.get('priceRange')
        page = request.args.get('page', type=int, default=1)
        per_page = request.args.get('per_page', type=int, default=10)
        
        query = ProductModel.query
        
        if type_filter:
            query = query.filter_by(type=type_filter)
        
        if price_range:
            try:
                min_price, max_price = map(float, price_range.split('-'))
                query = query.filter(ProductModel.price >= min_price, ProductModel.price <= max_price)
            except ValueError:
                return make_response(jsonify({"message": "Invalid price range format"}), 400)
        
        paginated_products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        product_list = []
        for product in paginated_products.items:
            product_data = {
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'type': product.type,
                'image': product.image  # Assuming you have this attribute
            }
            product_list.append(product_data)
        
        return {
            'products': product_list,
            'total_pages': paginated_products.pages,
            'total_items': paginated_products.total
        }, 200

class ProductByID(Resource):

    @jwt_required()
    #@jwt_required
    def get(self, id):
        product = ProductModel.query.filter_by(id=id).first()
        if product is None:
            return make_response(jsonify({"message": "Product not found"}), 404)
        response_dict = product.to_dict()
        return make_response(jsonify(response_dict), 200)

class OrderItemList(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not product_id:
            return make_response(jsonify({"msg": "Product ID is required"}), 400)

        try:
            order_item = OrderItem.query.filter_by(product_id=product_id, customer_id=current_user_id).first()

            if order_item:
                order_item.quantity += quantity
            else:
                order_item = OrderItem(product_id=product_id, quantity=quantity, customer_id=current_user_id)

            db.session.add(order_item)
            db.session.commit()

            return {
                'id': order_item.id,
                'product_id': order_item.product_id,
                'quantity': order_item.quantity,
                'product': {
                    'id': order_item.product.id,
                    'name': order_item.product.name,
                    'price': order_item.product.price,
                    'image': order_item.product.image
                }
            }, 201

        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"msg": f"Failed to add item to cart: {str(e)}"}), 500)

class OrderItemByID(Resource):
    @jwt_required()
    def delete(self, id):
        current_user_id = get_jwt_identity()
        order_item = OrderItem.query.filter_by(id=id, customer_id=current_user_id).first()
        if order_item is None:
            return make_response(jsonify({"msg": "Order item not found"}), 404)
        db.session.delete(order_item)
        db.session.commit()
        return '', 204

    @jwt_required()
    def put(self, id):
        data = request.get_json()
        current_user_id = get_jwt_identity()
        quantity = data.get('quantity')

        if not quantity or quantity < 1:
            return make_response(jsonify({"msg": "Invalid quantity"}), 400)

        order_item = OrderItem.query.filter_by(id=id, customer_id=current_user_id).first()
        if order_item is None:
            return make_response(jsonify({"msg": "Order item not found"}), 404)

        order_item.quantity = quantity
        db.session.commit()


        return {
            'id': order_item.id,
            'product_id': order_item.product_id,
            'quantity': order_item.quantity,
            'product': {
                'id': order_item.product.id,
                'name': order_item.product.name,
                'price': order_item.product.price,
                'image': order_item.product.image
            }
        }, 200

api.add_resource(ProductList, '/products')
api.add_resource(Products, '/products/')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(OrderItemList, '/order_items')
api.add_resource(OrderItemByID, '/order_items/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
