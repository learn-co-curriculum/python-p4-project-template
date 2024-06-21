
#!/usr/bin/env python3

import os
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, bcrypt, ma, jwt
from .resources import UserRegister, UserLogin, ProtectedResource, SpacecraftsListResource, SpacecraftResource, PlayersListResource, PlayerResource, MissionsListResource, MissionResource, CelestialBodiesListResource, CelestialBodyResource

def create_app():
    app = Flask(__name__, static_folder='../client/build', static_url_path='/')
    app.config.from_object(Config)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    
    # CORS configuration
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    api = Api(app)

    # Add resource routes
    api.add_resource(UserRegister, '/signup')
    api.add_resource(UserLogin, '/login')
    api.add_resource(ProtectedResource, '/protected')
    api.add_resource(SpacecraftsListResource, '/spacecrafts')
    api.add_resource(SpacecraftResource, '/spacecrafts/<int:spacecraft_id>')
    api.add_resource(PlayersListResource, '/players')
    api.add_resource(PlayerResource, '/players/<int:player_id>')
    api.add_resource(MissionsListResource, '/missions')
    api.add_resource(MissionResource, '/missions/<int:mission_id>')
    api.add_resource(CelestialBodiesListResource, '/celestial_bodies')
    api.add_resource(CelestialBodyResource, '/celestial_bodies/<int:celestial_body_id>')

    @app.errorhandler(400)
    def bad_request_error(error):
        return jsonify({'error': 'Bad request'}), 400

    @app.errorhandler(401)
    def unauthorized_error(error):
        return jsonify({'error': 'Unauthorized'}), 401

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(409)
    def conflict_error(error):
        return jsonify({'error': 'Conflict'}), 409

    @app.errorhandler(422)
    def unprocessable_entity_error(error):
        return jsonify({'error': 'Unprocessable entity'}), 422
    
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5555, debug=True)