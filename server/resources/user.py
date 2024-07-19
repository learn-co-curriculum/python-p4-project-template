from flask import jsonify, request, Blueprint
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS
from models import db, User
from flask_bcrypt import Bcrypt

user_bp = Blueprint('Users', __name__, url_prefix='/users')
CORS(user_bp)
user_api = Api(user_bp)
bcrypt=Bcrypt()

# Define the parsers
user_post_parser = reqparse.RequestParser()
user_post_parser.add_argument('username', required=True, help='Username is required')
user_post_parser.add_argument('email', required=True, help='Email is required')
user_post_parser.add_argument('password', required=True, help='Password is required')

user_put_parser = reqparse.RequestParser()
user_put_parser.add_argument('username', required=False)
user_put_parser.add_argument('email', required=False)
user_put_parser.add_argument('password', required=False)

class UserRegisterResource(Resource):
    def post(self):
        
        args = user_post_parser.parse_args()

        username = args['username']
        email = args['email']
        password = args['password']

        # Check if user already exists
        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            return  'User already exists', 409

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        new_user = User(username=username, email=email, password=hashed_password)

        # Add new user to the database
        db.session.add(new_user)
        db.session.commit()

        return 'user created successfully', 201






class UserResource(Resource):
    @jwt_required()
    def get(self, id=None):
        if id:
            user = User.query.get_or_404(id)
            return jsonify(user.serialize())
        else:
            users = User.query.all()
            return jsonify([user.serialize() for user in users])

    def post(self):
        data = request.get_json()
        
        # Validate input data
        if not data:
            return jsonify({'message': 'No input data provided'}), 400
            
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Check for existing user
        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            return jsonify({'message': 'User already exists'}), 409

        # Hash password and create user
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        new_user = User(username=username, email=email, password=hashed_password.decode('utf-8'))

        db.session.add(new_user)
        db.session.commit()

        return jsonify(new_user.serialize()), 201

    @jwt_required()
    def put(self, id):
        user = User.query.get_or_404(id)
        user_id = get_jwt_identity()
        
        if user.id != user_id:
            return 'Unauthorized access', 403

        
        args = user_put_parser.parse_args()
        
        # Update user details
        if args['username']:
            user.username = args['username']
        if args['email']:
            user.email = args['email']
        if args['password']:
            user.password = bcrypt.generate_password_hash(args['password']).decode('utf-8')





        db.session.commit()
        return jsonify(user.serialize()), 200

    @jwt_required()
    def delete(self, id):
        user = User.query.get_or_404(id)
        user_id = get_jwt_identity()
        
        if user.id != user_id:
            return jsonify({'message': 'Unauthorized access'}), 403

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 204

# Register the resource with the blueprint's API
user_api.add_resource(UserResource, '/', '/<int:id>')
user_api.add_resource(UserRegisterResource, '/register')

#localhost:5555/users/1
#localhost:5555/users/register....use post