from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

from config import db


# Models go here!

class Album(db.Model, SerializerMixin):
    serialize_rules = ('-reviews.album',)
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    cover_image = db.Column(db.String(255), nullable=True)
    reviews = db.relationship('Review', backref='album', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'genre': self.genre,
            'release_date': self.release_date.strftime('%Y-%m-%d'),
            'cover_image': self.cover_image,
            'reviews': [review.to_dict() for review in self.reviews]
        }
    

class Member(db.Model, SerializerMixin):
    serialize_rules = ('-reviews.member',)
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    join_date = db.Column(db.DateTime, default=func.now())
    reviews = db.relationship('Review', backref='member', lazy=True)

############add validations##################

class Review(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    review_date = db.Column(db.DateTime, default=func.now())
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'album_id': self.album_id,
            'member_id': self.member_id,
            'rating': self.rating,
            'comment': self.comment,
        }
    
