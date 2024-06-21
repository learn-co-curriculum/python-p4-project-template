from random import randint, choice
from faker import Faker
from .app import create_app
from .extensions import db
from .models import Player, Spacecraft, Mission, CelestialBody

fake = Faker()

def seed_players():
    for _ in range(10):
        player = Player(
            username=fake.user_name(),
            email=fake.email(),
            password=fake.password()
        )
        db.session.add(player)
    db.session.commit()

def seed_spacecrafts():
    for _ in range(10):
        spacecraft = Spacecraft(
            name=fake.word(),
            speed=randint(1000, 10000),
            fuel_log=randint(100, 1000),
            equipment=fake.sentence(),
            image=fake.image_url()
        )
        db.session.add(spacecraft)
    db.session.commit()

def seed_celestial_bodies():
    for _ in range(10):
        celestial_body = CelestialBody(
            name=fake.word(),
            distance=randint(1000, 10000),
            type=fake.word()
        )
        db.session.add(celestial_body)
    db.session.commit()

def seed_missions():
    players = Player.query.all()
    spacecrafts = Spacecraft.query.all()
    celestial_bodies = CelestialBody.query.all()

    for _ in range(10):
        mission = Mission(
            name=fake.word(),
            destination=fake.city(),
            reason=fake.sentence(),
            launch_date=fake.date_time_this_year(),
            player=choice(players),
            spacecraft=choice(spacecrafts),
            celestial_body=choice(celestial_bodies)
        )
        db.session.add(mission)
    db.session.commit()

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_players()
        seed_spacecrafts()
        seed_celestial_bodies()
        seed_missions()
        print("Seeding complete!")
