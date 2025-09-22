#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Import models
from models import Station, Pump, Staff, Sale, sale_staff

# Shell context for Flask CLI
@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'Station': Station,
        'Pump': Pump,
        'Staff': Staff,
        'Sale': Sale,
        'sale_staff': sale_staff
    }

# Views go here!

@app.route('/')
def index():
    return '<h1>Petrol Station Management API</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

