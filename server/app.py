from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import Config  # Ensure you have a valid `config.py` file

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)  # Load configuration from the `Config` class

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    try:
        from routes.auth import auth  # Ensure your `auth` blueprint is in the `routes` folder
        app.register_blueprint(auth, url_prefix="/auth")
    except ImportError as e:
        raise ImportError(f"Error importing auth blueprint: {e}")

    # Define a simple root route to test the app
    @app.route("/")
    def index():
        return {"message": "Welcome to the Flask application!"}, 200

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
