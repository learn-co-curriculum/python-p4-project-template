from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

from config import db


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    user_ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    user_category = db.Column(db.String(32), nullable=False)  # 'student' or 'lecturer'

    study_groups = db.relationship('StudyGroup', back_populates='owner')
    reviews = db.relationship('Review', back_populates='user')

    def __repr__(self):
        return f"<User {self.user_ID} {self.email}>"


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'

    course_ID = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(200), nullable=False, unique=True)

    study_groups = db.relationship('StudyGroup', back_populates='course')

    def __repr__(self):
        return f"<Course {self.course_ID} {self.course_name}>"


class StudyGroup(db.Model, SerializerMixin):
    __tablename__ = 'study_groups'

    study_group_ID = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    course_ID = db.Column(db.Integer, db.ForeignKey('courses.course_ID'), nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    owner_user_id = db.Column(db.Integer, db.ForeignKey('users.user_ID'), nullable=False)

    course = db.relationship('Course', back_populates='study_groups')
    owner = db.relationship('User', back_populates='study_groups')
    reviews = db.relationship('Review', back_populates='study_group', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<StudyGroup {self.study_group_ID} {self.name}>"


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    review_ID = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_ID'), nullable=False)
    study_group_id = db.Column(db.Integer, db.ForeignKey('study_groups.study_group_ID'), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='reviews')
    study_group = db.relationship('StudyGroup', back_populates='reviews')

    def __repr__(self):
        return f"<Review {self.review_ID} {self.stars}★>"
