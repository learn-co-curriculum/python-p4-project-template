from os import environ, name

from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

load_dotenv()


# Instantiate app, set attributes
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = environ.get("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.secret = environ.get("FLASK_SECRET")

app.json.compact = False

bcrypt = Bcrypt(app)

# Define metadata, instantiate db
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)


# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

if name == "main":
    app.run(
        port=environ.get("FLASK_RUN_PORT", 5555),
        debug=environ.get("FLASK_DEBUG", False),
    )
