#!/usr/bin/env python3


# Standard library imports


# Remote library imports
from flask import request, jsonify
from flask_restful import Resource


# Local imports
from config import app, db, api
# Add your model imports
from models import Album, Member, Review


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/albums', methods=['GET', 'POST'])
def handle_albums():
    if request.method == 'POST':
        data = request.json
        new_album = Album(**data)
        db.session.add(new_album)
        db.session.commit()
        return jsonify(new_album), 201

    albums = Album.query.all()
    return jsonify([album.to_dict() for album in albums]), 200

@app.route('/members', methods=['GET', 'POST'])
def handle_members():
    if request.method == 'POST':
        data = request.json
        new_member = Member(**data)
        db.session.add(new_member)
        db.session.commit()
        return jsonify(new_member), 201

    members = Member.query.all()
    return jsonify([member.to_dict() for member in members]), 200

@app.route('/reviews', methods=['GET', 'POST'])
def handle_reviews():
    if request.method == 'POST':
        data = request.json
        new_review = Review(**data)
        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.to_dict()), 201

    reviews = Review.query.all()
    return jsonify([review.to_dict() for review in reviews]), 200



if __name__ == '__main__':
    app.run(port=5555, debug=True)


