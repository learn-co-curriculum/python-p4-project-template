#!/usr/bin/env python3

from app import app
from models import db, Team, Player, Game, Performance
from datetime import datetime

with app.app_context():

    # Delete existing rows to avoid duplicate entries
    print("Deleting data...")
    Performance.query.delete()
    Game.query.delete()
    Player.query.delete()
    Team.query.delete()

    print("Creating teams...")
    patriots = Team(name="Patriots", city="New England")
    giants = Team(name="Giants", city="New York")
    eagles = Team(name="Eagles", city="Philadelphia")
    teams = [patriots, giants, eagles]

    print("Creating players...")

    brady = Player(name="Tom Brady", position="Quarterback", team=patriots)
    barkley = Player(name="Saquon Barkley", position="Running Back", team=giants)
    wentz = Player(name="Carson Wentz", position="Quarterback", team=eagles)
    players = [brady, barkley, wentz]

    print("Creating games...")

    game1 = Game(date=datetime(2024, 9, 10), home_team=patriots, away_team=giants)
    game2 = Game(date=datetime(2024, 9, 12), home_team=giants, away_team=eagles)
    games = [game1, game2]

    print("Creating performances...")

    performance1 = Performance(player=brady, game=game1, score=3)
    performance2 = Performance(player=barkley, game=game1, score=4)
    performance3 = Performance(player=wentz, game=game2, score=2)
    performance4 = Performance(player=barkley, game=game2, score=5)
    performances = [performance1, performance2, performance3, performance4]

    db.session.add_all(teams)
    db.session.add_all(players)
    db.session.add_all(games)
    db.session.add_all(performances)
    db.session.commit()

    print("Seeding done!")
