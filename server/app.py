from datetime import datetime
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from flask_restful import Api, Resource
from werkzeug.exceptions import NotFound
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

from models import MenuItem, Order, OrderItem, User, db  # Import only necessary models and db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)  # Allow requests from all origins

db.init_app(app)
migrate = Migrate(app, db)

api = Api(app)

# Views go here

@app.route('/')
def index():
    return 'Welcome to your Flask App!'


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/menu', methods=['GET', 'POST', 'DELETE'])
def handle_menu_items():
    if request.method == 'GET':
        menu_items = MenuItem.query.all()
        return jsonify([item.to_dict() for item in menu_items])
    
    elif request.method == 'POST':
        data = request.json
        if not data or 'name' not in data or 'price' not in data:
            return jsonify({"error": "Invalid data. 'name' and 'price' are required."}), 400
        
        new_menu_item = MenuItem(
            name=data['name'],
            price=data['price'],
            description=data.get('description')
        )

        db.session.add(new_menu_item)
        db.session.commit()

        return jsonify({"message": "Menu item created successfully.", "menu_item": new_menu_item.to_dict()}), 201

@app.route('/menu/<int:id>', methods=['GET', 'DELETE'])
def handle_menu_item(id):
    menu_item = MenuItem.query.filter_by(id=id).first()
    if not menu_item:
        raise NotFound("Menu item not found")
    
    if request.method == 'GET':
        return jsonify(menu_item.to_dict())
    
    elif request.method == 'DELETE':
        db.session.delete(menu_item)
        db.session.commit()
        return jsonify({"message": "Menu item deleted successfully"})
@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        orders_list = [order.to_dict() for order in orders]
        return jsonify(orders_list), 200
    except Exception as e:
        app.logger.error(f"Error fetching orders: {e}")
        return jsonify({"error": "Failed to fetch orders"}), 500

# Route to get a specific order by ID
@app.route('/api/orders/<int:id>', methods=['GET'])
def get_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order_data = order.to_dict()
        order_data['order_items'] = [
            {
                'menuitem_id': item.menu_item_id,
                'name': item.menu_item.name,
                'price': item.menu_item.price,
                'quantity': item.quantity
            } for item in order.order_items
        ]
        return jsonify(order_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching order: {e}")
        return jsonify({"error": "Failed to fetch order"}), 500


# Route to create a new order
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/orders', methods=['POST'])
def place_order():
    try:
        data = request.json
        # Process the order
        # Example: save to database, etc.
        
        order_id = "12345"  # Example order ID
        return jsonify({"orderId": order_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

# Route to update a specific order by ID
@app.route('/api/orders/<int:id>', methods=['PUT'])
def update_order(id):
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        order_items = data.get('order_items')

        if not user_id or not order_items:
            return jsonify({"error": "Missing user_id or order_items"}), 400

        order = Order(user_id=user_id, order_date=datetime.utcnow(), status='Pending')
        db.session.add(order)
        db.session.commit()

        for item in order_items:
            menu_item_id = item.get('menuitem_id')
            quantity = item.get('quantity')

            if not menu_item_id or not quantity:
                return jsonify({"error": "Missing menuitem_id or quantity"}), 400

            menu_item = MenuItem.query.get(menu_item_id)
            if not menu_item:
                return jsonify({"error": "Menu item not found"}), 404

            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=menu_item_id,
                quantity=quantity,
                menuitem_name=menu_item.name,
                menuitem_price=menu_item.price,
                menu_item_image=menu_item.image
            )
            db.session.add(order_item)

        db.session.commit()
        return jsonify({"orderId": order.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating order: {e}")  # More detailed error logging
        return jsonify({"error": "Failed to create order"}), 500

if __name__ == '__main__':
    app.run(port=5555, debug=True)