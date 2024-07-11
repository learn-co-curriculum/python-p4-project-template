#!/usr/bin/env python3

from models import db, Album, Member, Review
from datetime import datetime
from app import app
from faker import Faker
import random
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

fake = Faker()

# Spotify API credentials IMPORTANT!!!!!
SPOTIFY_CLIENT_ID = 'ee66b6cce6c64912935ff635ad7ece6d'
SPOTIFY_CLIENT_SECRET = 'c528df65ca6341e29fb1712bf804ad25'

# Set up Spotify API client
auth_manager = SpotifyClientCredentials(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET)
sp = Spotify(auth_manager=auth_manager)

with app.app_context():
    db.drop_all()
    db.create_all()

    members = []
    for _ in range(10):
        member = Member(
            name=fake.name(),
            email=fake.email(),
            join_date=fake.date_between(start_date='-5y', end_date='today')
        )
        members.append(member)
        db.session.add(member)

    db.session.commit()

    # List of album names to search for
    album_names = [
        "Thriller",
        "Back in Black",
        "The Dark Side of the Moon",
        "The Wall",
        "Abbey Road",
        "Hotel California",
        "Rumours",
        "Led Zeppelin IV",
        "Sgt. Pepper's Lonely Hearts Club Band",
        "Come On Over",
        "Jagged Little Pill",
        "21",
        "Bad",
        "1989",
        "Future Nostalgia",
        "Fearless",
        "Born in the U.S.A.",
        "Nevermind",
        "Purple Rain",
        "The Marshall Mathers LP",
        "Goodbye Yellow Brick Road",
        "Appetite for Destruction",
        "Back to Black",
        "A Night at the Opera",
        "Tapestry"
    ]

    # Fetchdes the album data from Spotify API
    def fetch_album_data(album_name):
        results = sp.search(q=f'album:{album_name}', type='album', limit=1)
        if results['albums']['items']:
            return results['albums']['items'][0]
        return None

    albums = []
    for album_name in album_names:
        data = fetch_album_data(album_name)
        if data:
            release_date = data['release_date']
            if len(release_date) == 4:
                release_date = datetime.strptime(release_date, "%Y")
            elif len(release_date) == 7:
                release_date = datetime.strptime(release_date, "%Y-%m")
            else:
                release_date = datetime.strptime(release_date, "%Y-%m-%d")

            embed_link = f"https://open.spotify.com/embed/album/{data['id']}?utm_source=generator&theme=0"

            album_details = sp.album(data['id'])

            album = Album(
                title=data['name'],
                artist=data['artists'][0]['name'],
                genre=', '.join(album_details.get('genres', [])),
                release_date=release_date,
                cover_image=data['images'][0]['url'] if data['images'] else None,
                embed_link=embed_link,
                popularity=album_details.get('popularity'),
                label=album_details.get('label'),
                tracks=', '.join([track['name'] for track in album_details['tracks']['items']])
            )
            albums.append(album)
            db.session.add(album)

    db.session.commit()

    reviews = []
    for _ in range(50):
        review = Review(
            album_id=random.choice(albums).id,
            member_id=random.choice(members).id,
            rating=random.randint(1, 5),
            comment=fake.text(max_nb_chars=200)
        )
        reviews.append(review)
        db.session.add(review)

    db.session.commit()