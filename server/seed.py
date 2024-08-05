
import datetime
from app import app
from models import db, Employee, Meeting, Manager, EmployeeMeeting

with app.app_context():

    # Delete all rows in tables
    EmployeeMeeting.query.delete()
    Employee.query.delete()
    Meeting.query.delete()
    Manager.query.delete()
    db.session.commit()

    # Add managers
    mg1 = Manager(name='Trooper Wright', department='Installation')
    mg2 = Manager(name='Brant Boisvert', department='Sound & Lighting')
    mg3 = Manager(name='Josh Burkhaulter', department='Programming')
    db.session.add_all([mg1, mg2, mg3])
    db.session.commit()

    # Add employees
    e1 = Employee(name="Katie Swansong", hire_date=datetime.datetime(2022, 5, 17), manager=mg1)
    e2 = Employee(name="Tristan Yang", hire_date=datetime.datetime(2020, 1, 30), manager=mg1)
    e3 = Employee(name="Mallory Jewell", hire_date=datetime.datetime(2021, 12, 1), manager=mg3)
    e4 = Employee(name="Matt Herndon", hire_date=datetime.datetime(2015, 1, 2), manager=mg2)
    db.session.add_all([e1, e2, e3, e4])
    db.session.commit()

    # Add meetings
    m1 = Meeting(topic="Software Engineering Weekly Update",
                 scheduled_time=datetime.datetime(2023, 10, 31, 9, 30),
                 location="Building A, Room 142")
    m2 = Meeting(topic="Github Issues Brainstorming",
                 scheduled_time=datetime.datetime(2023, 12, 1, 15, 15),
                 location="Building D, Room 430")
    db.session.add_all([m1, m2])
    db.session.commit()

    em1 = EmployeeMeeting(employee=e1, meeting=m1, rsvp=True)
    em2 = EmployeeMeeting(employee=e1, meeting=m2, rsvp=True)
    em3 = EmployeeMeeting(employee=e2, meeting=m2, rsvp=False)
    em4 = EmployeeMeeting(employee=e3, meeting=m2, rsvp=True)
    em5 = EmployeeMeeting(employee=e4, meeting=m2, rsvp=True)
    db.session.add_all([em1, em2, em3, em4, em5])
    db.session.commit()
