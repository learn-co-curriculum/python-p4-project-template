#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify
from flask_restful import Resource
import requests


# Local imports
from config import app, db, api
# Add your model imports
from models import Album, Member, Review

# Spotify API credentials IMPORTANT!!!!!
SPOTIFY_API_URL = 'https://api.spotify.com/v1'
SPOTIFY_ACCESS_TOKEN = 'BQCASOpWr4TNdUs_STXy4NxvdA0WG9iwQa4nszGXZmnDrypdrT5KtIb5xIAZDGa6RA_AjmNnHY3NQ_grA4pV570rTpxT6MYu8y3aZQmeG5lwIgA504Q'

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.route('/api/albums/<string:album_name>', methods=['GET'])
def get_album(album_name):
    headers = {
        'Authorization': f'Bearer {SPOTIFY_ACCESS_TOKEN}'
    }
    response = requests.get(f'{SPOTIFY_API_URL}/search', headers=headers, params={
        'q': album_name,
        'type': 'album'
    })
    if response.status_code == 200:
        albums = response.json().get('albums', {}).get('items', [])
        return jsonify(albums)
    else:
        return jsonify({'error': 'Failed to fetch data from Spotify'}), response.status_code


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

