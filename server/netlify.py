from app import app
from flask import Flask
from flask_cors import CORS

CORS(app)

def handler(event, context):
    return app(event, context)