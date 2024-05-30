#!/usr/bin/env python3

from app import app
from models import db, Team, Player, Game, Performance
from datetime import datetime

def seed_data():
    with app.app_context():

        try:
            # Delete existing rows to avoid duplicate entries
            print("Deleting data...")
            # Performance.query.delete()
            Game.query.delete()
            Player.query.delete()
            Team.query.delete()

            # Commit after deletions to ensure the changes are saved
            db.session.commit()

            print("Creating teams...")
            patriots = Team(name="Patriots", city="New England")
            giants = Team(name="Giants", city="New York")
            eagles = Team(name="Eagles", city="Philadelphia")
            rams = Team(name="Rams", city="Los Angeles")
            teams = [patriots, giants, eagles, rams]

            print("Creating players...")
            brady = Player(name="Tom Brady", position="Quarterback", team=patriots)
            gibson = Player(name="Antonio Gibson", position="Running Back", team=patriots)
            jones = Player(name="Daniel Jones", position="Quarterback", team=giants)
            singletary = Player(name="Devin Singletary", position="Running Back", team=giants)
            wentz = Player(name="Carson Wentz", position="Quarterback", team=eagles)
            barkley = Player(name="Saquon Barkley", position="Running Back", team=eagles)
            stafford = Player(name="Matthew Stafford", position="Quarterback", team=rams)  # Corrected name
            corum = Player(name="Blake Corum", position="Running Back", team=rams)
            players = [brady, gibson, jones, singletary, wentz, barkley, stafford, corum]  # Added missing players

            print("Creating games...")
            game1 = Game(date=datetime(2023, 11, 26), home_team=patriots, away_team=giants, home_team_score=7, away_team_score=10)
            game2 = Game(date=datetime(2023, 10, 8), home_team=rams, away_team=eagles, home_team_score=14, away_team_score=23)
            games = [game1, game2]

            print("Creating performances...")
            performance1 = Performance(player=brady, game=game1, score=3)
            performance2 = Performance(player=barkley, game=game1, score=4)
            performance3 = Performance(player=wentz, game=game2, score=2)
            performance4 = Performance(player=barkley, game=game2, score=5)
            performances = [performance1, performance2, performance3, performance4]

            # Add all records to the session
            print("Adding records to the database...")
            db.session.add_all(teams)
            db.session.add_all(players)
            db.session.add_all(games)
            db.session.add_all(performances)
            db.session.commit()

            print("Seeding done!")
        except Exception as e:
            print(f"An error occurred: {e}")
            db.session.rollback()

if __name__ == '__main__':
    seed_data()
