from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)

    players = db.relationship('Player', back_populates='team')
    games_home = db.relationship('Game', foreign_keys='Game.home_team_id', back_populates='home_team')
    games_away = db.relationship('Game', foreign_keys='Game.away_team_id', back_populates='away_team')

    def to_dict(self, include_players=False):
        data = {
            'id': self.id,
            'name': self.name,
            'city': self.city,
        }
        if include_players:
            data['players'] = [player.to_dict() for player in self.players]
        return data

    def __repr__(self):
        return f'<Team {self.name}>'

class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)

    team = db.relationship('Team', back_populates='players')
    performances = db.relationship('Performance', back_populates='player')

    def to_dict(self, include_team=False):
        data = {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'team_id': self.team_id,
        }
        if include_team:
            data['team'] = self.team.to_dict()
        return data

    def __repr__(self):
        return f'<Player {self.name}>'

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable=False)
    home_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    away_team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)

    home_team = db.relationship('Team', foreign_keys=[home_team_id], back_populates='games_home')
    away_team = db.relationship('Team', foreign_keys=[away_team_id], back_populates='games_away')
    performances = db.relationship('Performance', back_populates='game')

    def to_dict(self, include_teams=False):
        data = {
            'id': self.id,
            'date': self.date,
            'home_team_id': self.home_team_id,
            'away_team_id': self.away_team_id,
        }
        if include_teams:
            data['home_team'] = self.home_team.to_dict()
            data['away_team'] = self.away_team.to_dict()
        return data

    def __repr__(self):
        return f'<Game {self.date}>'

class Performance(db.Model):
    __tablename__ = 'performances'

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    player = db.relationship('Player', back_populates='performances')
    game = db.relationship('Game', back_populates='performances')

    def to_dict(self, include_player=False, include_game=False):
        data = {
            'id': self.id,
            'score': self.score,
            'player_id': self.player_id,
            'game_id': self.game_id,
        }
        if include_player:
            data['player'] = self.player.to_dict()
        if include_game:
            data['game'] = self.game.to_dict()
        return data

    def __repr__(self):
        return f'<Performance {self.score}>'
