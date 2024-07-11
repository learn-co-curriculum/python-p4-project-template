from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

from config import db

# Models go here!

class Album(db.Model, SerializerMixin):
    __tablename__ = 'albums'
    serialize_rules = ('-reviews',)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50), nullable=True)
    release_date = db.Column(db.Date, nullable=False)
    cover_image = db.Column(db.String(255), nullable=True)
    embed_link = db.Column(db.String(255), nullable=True)
    popularity = db.Column(db.Integer, nullable=True)
    label = db.Column(db.String(100), nullable=True)
    tracks = db.Column(db.Text, nullable=True)
    reviews = db.relationship('Review', backref='album', lazy=True)


class Member(db.Model, SerializerMixin):
    __tablename__ = 'members'
    serialize_rules = ('-reviews',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    join_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    reviews = db.relationship('Review', backref='member', lazy=True)


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('albums.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False)
    review_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)

    def __init__(self, album_id, member_id, rating, comment):
        self.album_id = album_id
        self.member_id = member_id
        self.rating = max(1, min(5, rating))
        self.comment = comment