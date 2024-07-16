from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, current_user
from flask import Blueprint
from flask_restful import Api, Resource, reqparse
from models import Customer, db
from flask_bcrypt import Bcrypt

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')
auth_api = Api(auth_bp)
jwt = JWTManager()

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return Customer.query.filter_by(id=identity).first()

bcrypt = Bcrypt()

register_args = reqparse.RequestParser()
register_args.add_argument('email', type=str, required=True, help='Email is required')
register_args.add_argument('name', type=str, required=True, help='Name is required')
register_args.add_argument('gender', type=str, required=True, help='Gender is required')
register_args.add_argument('password1', type=str, required=True, help='Password is required')
register_args.add_argument('password2', type=str, required=True, help='Password confirmation is required')

# Registering
class Signup(Resource):
    def post(self):
        data = register_args.parse_args()
        # Hash password
        if data.get("password1") != data.get("password2"):
            return {"msg": "Passwords don't match"}, 400
        hashed_password = bcrypt.generate_password_hash(data.get('password1')).decode('utf-8')
        new_user = Customer(email=data.get('email'),gender=data.get('gender'),name=data.get('name'), password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return {"msg": "You have signed up successfully"}, 201

login_args = reqparse.RequestParser()
login_args.add_argument('email', type=str, required=True, help='Email is required')
login_args.add_argument('password', type=str, required=True, help='Password is required')

class Login(Resource):
    def post(self):
        data = login_args.parse_args()
        user = Customer.query.filter_by(email=data.get('email')).first()
        if not user or not bcrypt.check_password_hash(user.password, data.get('password')):
            return {"msg": "Invalid email or password"}, 401
        
        token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {"token": token, 'refresh_token': refresh_token}, 200
    
    @jwt_required()
    def get(self):
        user = current_user
        return {'email': user.email}, 200

# Access to certain resource
auth_api.add_resource(Signup, '/signup')
auth_api.add_resource(Login, '/login')

# def delete(self):
#         try:
#             # Delete all products from the database
#             ProductModel.query.delete()
#             db.session.commit()
#             return {'message': 'All products deleted successfully'}, 200
#         except Exception as e:
#             # Handle any exceptions
#             db.session.rollback()
#             return {'error': str(e)}, 500
