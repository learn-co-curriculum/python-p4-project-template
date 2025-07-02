from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Configuration for production
    import os
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')

    # Attach extensions
    db.init_app(app)
    migrate.init_app(app, db)  # ✅ Only once and after db.init_app
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import models before migration to register them
    from app import models  # ✅ Correct position here

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.stay_routes import stay_bp
    from app.routes.booking_routes import booking_bp
    from app.routes.review_routes import review_bp
    from app.routes.favorite_routes import favorite_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(stay_bp)  # stay_bp already has /stays prefix
    app.register_blueprint(booking_bp, url_prefix='/bookings')
    app.register_blueprint(review_bp, url_prefix='/reviews')
    app.register_blueprint(favorite_bp, url_prefix='/favorites')

    return app
