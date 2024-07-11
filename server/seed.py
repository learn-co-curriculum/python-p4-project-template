#!/usr/bin/env python3

from faker import Faker

from app import app
from models import db, User, Event, Registration
import random

with app.app_context():
    
    fake = Faker()

    User.query.delete()

    users = []
    for i in range(10):
        user = User(
            name = fake.name(),
            username = fake.user_name(),
            email = fake.email(),
            password_hash = fake.password(),
        )
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

    Event.query.delete()

    events = []
    for i in range(10):
        user = random.choice(users)
        event = Event(
            title=fake.sentence(nb_words=5),
            description=fake.text(max_nb_chars=200),
            date=fake.date_time_between(start_date='-1y', end_date='+1y'),
            location=fake.city(),
            no_of_registrations = fake.random_digit(),
            creator_id=user.id
        )
        events.append(event)
        db.session.add(event)
        db.session.commit()

    Registration.query.delete()

    registrations = []
    for i in range(10):
        event = random.choice(events)
        registration = Registration(
            event_id=event.id,
            review=fake.sentence(),
            registered_at=fake.date_this_month(),
        )
        db.session.add(registration)
        db.session.commit()
        