#!/usr/bin/env python3
from models import db, Team, Player, Game, Performance
from flask_migrate import Migrate
from flask import Flask, request, make_response, jsonify
from flask_restful import Api, Resource
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

class Teams(Resource):
    def get(self):
        teams = Team.query.all()
        return make_response(jsonify([team.to_dict() for team in teams]), 200)

    def post(self):
        data = request.json
        new_team = Team(name=data['name'], city=data['city'])
        db.session.add(new_team)
        db.session.commit()
        return make_response(jsonify(new_team.to_dict()), 201)

api.add_resource(Teams, '/teams')

class TeamsById(Resource):
    def get(self, id):
        team = db.session.query(Team).get(id)
        if not team:
            return make_response({"error": "Team not found"}, 404)
        return make_response(jsonify(team.to_dict()), 200)

    def put(self, id):
        data = request.get_json()
        team = Team.query.get(id)
        if not team:
            return make_response(jsonify({"error": "Team not found"}), 404)
        team.name = data['name']
        team.city = data['city']
        db.session.commit()
        return make_response(jsonify(team.to_dict()), 200)

    def delete(self, id):
        team = Team.query.get(id)
        if not team:
            return make_response(jsonify({"error": "Team not found"}), 404)
        db.session.delete(team)
        db.session.commit()
        return make_response("", 204)

api.add_resource(TeamsById, '/teams/<int:id>')

class Players(Resource):
    def get(self):
        players = Player.query.all()
        return make_response(jsonify([player.to_dict() for player in players]), 200)
    
    def post(self):
        data = request.get_json()
        new_player = Player(name=data['name'], position=data['position'], team_id=data['team_id'])
        db.session.add(new_player)
        db.session.commit()
        return make_response(jsonify(new_player.to_dict()), 201)

api.add_resource(Players, '/players')

class PlayersById(Resource):
    def get(self, id):
        player = db.session.query(Player).get(id)
        if not player:
            return make_response({"error": "Player not found"}, 404)
        return make_response(jsonify(player.to_dict()), 200)
    
    def put(self, id):
        data = request.get_json()
        player = Player.query.get(id)
        if not player:
            return make_response(jsonify({"error": "Player not found"}), 404)
        player.name = data['name']
        player.position = data['position']
        player.team_id = data['team_id']
        db.session.commit()
        return make_response(jsonify(player.to_dict()), 200)

    def delete(self, id):
        player = Player.query.get(id)
        if not player:
            return make_response(jsonify({"error": "Player not found"}), 404)
        db.session.delete(player)
        db.session.commit()
        return make_response("", 204)

api.add_resource(PlayersById, '/players/<int:id>')

class Games(Resource):
    def get(self):
        games = Game.query.all()
        return make_response(jsonify([game.to_dict() for game in games]), 200)
    
    def post(self):
        data = request.get_json()
        new_game = Game(date=data['date'], home_team_id=data['home_team_id'], away_team_id=data['away_team_id'])
        db.session.add(new_game)
        db.session.commit()
        return make_response(jsonify(new_game.to_dict()), 201)

api.add_resource(Games, '/games')

class GamesById(Resource):
    def get(self, id):
        game = db.session.query(Game).get(id)
        if not game:
            return make_response({"error": "Game not found"}, 404)
        return make_response(jsonify(game.to_dict()), 200)
    
    def put(self, id):
        data = request.get_json()
        game = Game.query.get(id)
        if not game:
            return make_response(jsonify({"error": "Game not found"}), 404)
        game.date = data['date']
        game.home_team_id = data['home_team_id']
        game.away_team_id = data['away_team_id']
        db.session.commit()
        return make_response(jsonify(game.to_dict()), 200)

    def delete(self, id):
        game = Game.query.get(id)
        if not game:
            return make_response(jsonify({"error": "Game not found"}), 404)
        db.session.delete(game)
        db.session.commit()
        return make_response("", 204)

api.add_resource(GamesById, '/games/<int:id>')

class Performances(Resource):
    def post(self):
        data = request.get_json()
        new_performance = Performance(score=data['score'], player_id=data['player_id'], game_id=data['game_id'])
        db.session.add(new_performance)
        db.session.commit()
        return make_response(jsonify(new_performance.to_dict()), 201)

api.add_resource(Performances, '/performances')

@app.route("/")
def index():
    return "<h1>NFL Management API</h1>"

if __name__ == "__main__":
    app.run(port=5555, debug=True)
