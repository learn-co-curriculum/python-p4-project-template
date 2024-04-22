from faker import Faker
from app import db, app
from models import User, Role, Department, TimeLog
from werkzeug.security import generate_password_hash
from random import choice
from datetime import datetime, time

# Instantiate Faker object
fake = Faker()

def create_tables():
    with app.app_context():
        db.create_all()  # This creates all tables according to your models
        print("All tables created.")

def calculate_hours(clock_in, clock_out):
    """Calculate hours between two time objects."""
    start = datetime.combine(datetime.min, clock_in)  # Combine with minimum date
    end = datetime.combine(datetime.min, clock_out)  # Combine with minimum date
    duration = end - start
    total_hours = duration.total_seconds() / 3600  # Convert seconds to hours
    if total_hours < 0:
        total_hours += 24  # Adjust for overnight work
    return round(total_hours, 2)  # Round to two decimal places

def seed_database():
    db.session.query(TimeLog).delete()
    db.session.query(User).delete()
    db.session.query(Role).delete()
    db.session.query(Department).delete()
    db.session.commit()

    # Create and commit roles
    admin_role = Role(name='Manager', description='Administrator role')
    employee_role = Role(name='Employee', description='Employee role')
    db.session.add(admin_role)
    db.session.add(employee_role)
    db.session.commit()

    # Create and commit departments
    admin_department = Department(name='Admin')
    team_member_department = Department(name='Team Member')
    db.session.add(admin_department)
    db.session.add(team_member_department)
    db.session.commit()

    # Seed users
    users = []
    for _ in range(10):
        user_data = {
            'username': fake.user_name(),
            'name': fake.name(),
            'email': fake.email(),
            'password_hash': generate_password_hash(fake.password()),
            'role_id': choice([admin_role.id, employee_role.id]),
            'department_id': choice([admin_department.id, team_member_department.id])
        }
        users.append(User(**user_data))
    db.session.bulk_save_objects(users)
    db.session.commit()  # Commit users after they're added

    # Fetch users from the database
    users = User.query.all()

    # Now that users are seeded, let's create time logs
    time_logs = []
    for user in users:
        for _ in range(2):  # Assume 2 logs per user
            start_datetime = fake.date_time_this_year()
            end_datetime = fake.date_time_between_dates(datetime_start=start_datetime, datetime_end=datetime.now())
            clock_in_time = start_datetime.time()
            clock_out_time = end_datetime.time()
            worked_hours = calculate_hours(clock_in_time, clock_out_time)

            time_log = TimeLog(
                date=start_datetime.date(),
                clock_in=clock_in_time,
                clock_out=clock_out_time,
                hours_worked=worked_hours,  # Correctly set hours worked
                total_hours=worked_hours,  # Assume total_hours is the same as hours worked for seeding
                status=choice(['Pending', 'Approved', 'Rejected']),
                user_id=user.id  # Set the user_id for each TimeLog object
            )
            time_logs.append(time_log)  # Correct usage of list append
    db.session.bulk_save_objects(time_logs)
    db.session.commit()
    print("Database seeded successfully.")

if __name__ == '__main__':
    with app.app_context():
        create_tables()
        seed_database()
