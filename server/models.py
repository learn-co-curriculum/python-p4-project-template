from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from .extensions import db, bcrypt, ma  
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

class Player(db.Model, SerializerMixin):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    _password_hash = db.Column(db.String())

    serialize_rules = ('-missions.player', '-_password_hash')

    @property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f'<Player {self.username}>'

class PlayerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Player
        load_instance = True
        exclude = ('_password_hash',)

class Spacecraft(db.Model, SerializerMixin):
    __tablename__ = 'spacecrafts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    speed = db.Column(db.Integer(), nullable=False)
    fuel_log = db.Column(db.Integer(), nullable=False)
    equipment = db.Column(db.String())
    image = db.Column(db.String(), nullable=True)

    serialize_rules = ('-missions.spacecraft',)

    def __repr__(self):
        return f'<Spacecraft {self.name}>'

class SpacecraftSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Spacecraft
        load_instance = True

class Mission(db.Model, SerializerMixin):
    __tablename__ = 'missions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    destination = db.Column(db.String(), nullable=False)
    reason = db.Column(db.String())
    launch_date = db.Column(db.DateTime, nullable=False)

    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    spacecraft_id = db.Column(db.Integer, db.ForeignKey('spacecrafts.id'), nullable=False)
    celestial_body_id = db.Column(db.Integer, db.ForeignKey('celestial_bodies.id'), nullable=False)

    def __repr__(self):
        return f'<Mission {self.name}>'

class MissionSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Mission
        load_instance = True

class CelestialBody(db.Model, SerializerMixin):
    __tablename__ = 'celestial_bodies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    distance = db.Column(db.Integer(), nullable=False)
    type = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f'<CelestialBody {self.name} ({self.type})>'

class CelestialBodySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CelestialBody
        load_instance = True
        

# Define relationships after all classes are defined
Player.missions = db.relationship('Mission', backref='player', lazy='dynamic')
Spacecraft.missions = db.relationship('Mission', backref='spacecraft', lazy='dynamic')
CelestialBody.missions = db.relationship('Mission', backref='celestial_body', lazy='dynamic')