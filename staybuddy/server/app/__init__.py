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
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'secret'

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

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(stay_bp)  # stay_bp already has /stays prefix
    app.register_blueprint(booking_bp, url_prefix='/bookings')
    app.register_blueprint(review_bp, url_prefix='/reviews')

    return app
