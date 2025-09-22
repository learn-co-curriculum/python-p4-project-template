#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Import models
from models import Station, Pump, Staff, Sale, sale_staff
# Import dashboard routes
from dashboard import get_sales_summary, get_fuel_trends, get_station_performance

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

# Register dashboard routes
app.add_url_rule('/api/analytics/sales-summary', 'get_sales_summary', get_sales_summary, methods=['GET'])
app.add_url_rule('/api/analytics/fuel-trends', 'get_fuel_trends', get_fuel_trends, methods=['GET'])
app.add_url_rule('/api/analytics/station-performance', 'get_station_performance', get_station_performance, methods=['GET'])


if __name__ == '__main__':
    app.run(port=5555, debug=True)

