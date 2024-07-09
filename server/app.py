#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from sqlalchemy.orm import backref

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with your secret key

# Initialize database
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
CORS(app)  # Enable CORS for development, adjust for production

__

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
