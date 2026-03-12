#!/usr/bin/env python3

"""Seed script for development.

This script creates minimal sample records so the app can be exercised
locally. Run it from the `server/` directory.
"""

from faker import Faker

# Local imports
from app import app
from models import db, User, Course, StudyGroup


def run_seed():
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Create tables if they don't exist
        db.create_all()

        # Only create sample data if none exists
        if not Course.query.first():
            course = Course(course_name="Sample Course")
            db.session.add(course)
            db.session.commit()

        if not User.query.first():
            lecturer = User(name=fake.name(), email=fake.email(), user_category='lecturer')
            student = User(name=fake.name(), email=fake.email(), user_category='student')
            db.session.add_all([lecturer, student])
            db.session.commit()

            # Create a study group owned by lecturer for the sample course
            course = Course.query.first()
            sg = StudyGroup(name="Sample Group", course_ID=course.course_ID, owner_user_id=lecturer.user_ID)
            db.session.add(sg)
            db.session.commit()

        print("Seed complete.")


if __name__ == '__main__':
    run_seed()
