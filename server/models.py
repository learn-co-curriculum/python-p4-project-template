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
    # home_team_score = db.relationship('Score', foreign_keys='Game.home_team_score', back_populates='home_team_score')
    # away_team_score = db.relationship('Score', foreign_keys='Game.away_team_score', back_populates='away_team_score')
    def to_dict(self, include_players=False, include_games=False):
        data = {
            'id': self.id,
            'name': self.name,
            'city': self.city,
        }
        if include_players:
            data['players'] = [player.to_dict() for player in self.players]
        if include_games:
            data['games'] = [g.to_dict() for g in self.games_home + self.games_away]
        return data
    


    def __repr__(self):
        return f'<Team {self.name}>'

class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    position = db.Column(db.String, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    # home_team_score_id = db.Column(db.integer, db.ForeignKey('games.id'), nullable=False)
    # away_team_score_id = db.Column(db.integer, db.ForeignKey('games.id'), nullable=False)

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
    home_team_score = db.Column(db.Integer)
    away_team_score = db.Column(db.Integer)


    home_team = db.relationship('Team', foreign_keys=[home_team_id], back_populates='games_home')
    away_team = db.relationship('Team', foreign_keys=[away_team_id], back_populates='games_away')
    # away_team_score = db.relationship('Team', foreign_keys=[away_team_score], back_populates='away_team_score')
    # home_team_score = db.relationship('Team', foreign_keys=[home_team_score], back_populates='home_team_score')
    performances = db.relationship('Performance', back_populates='game')

    def to_dict(self, include_teams=False):
        data = {
            'id': self.id,
            'date': self.date,
            'home_team_id': self.home_team_id,
            'away_team_id': self.away_team_id,
            'home_team_score': self.home_team_score,
            'away_team_score': self.away_team_score,
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

class FantasyTeam(db.Model):
    __tablename__ = 'fantasy_teams'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    players = db.relationship('Player', secondary='fantasy_team_players', backref='fantasy_teams')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

# Define the join table for the many-to-many relationship between fantasy teams and players
fantasy_team_players = db.Table('fantasy_team_players',
    db.Column('fantasy_team_id', db.Integer, db.ForeignKey('fantasy_teams.id'), primary_key=True),
    db.Column('player_id', db.Integer, db.ForeignKey('players.id'), primary_key=True)
)
