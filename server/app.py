#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Recipe

# Views go here!

if __name__ == '__main__':
    app.run(port=5555, debug=True)
