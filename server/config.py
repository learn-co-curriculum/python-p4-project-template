import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Instantiate app, set attributes
app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Ensure the instance directory exists
if not os.path.exists(os.path.join(BASE_DIR, 'instance')):
    os.makedirs(os.path.join(BASE_DIR, 'instance'))
    
# Use environment variable for the database URI or default to a local SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI", f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'app.db')}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with your actual secret key
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# Define metadata and instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)