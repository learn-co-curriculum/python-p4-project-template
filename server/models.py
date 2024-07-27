from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    serialize_rules = ('-password', '-passengers.user')
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    passengers = db.relationship('Passenger', back_populates='user')
    ships = association_proxy('passengers', 'ship')
    transactions = db.relationship('Transaction', back_populates='user')

    def __repr__(self):
        return f'<User {self.name}>'

class Passenger(db.Model, SerializerMixin):
    __tablename__ = "passengers"
    serialize_rules = ('-user.passengers', '-ship.passengers')
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ticket_number = db.Column(db.String(10), unique=True, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    ship_id = db.Column(db.Integer, db.ForeignKey('ships.id'), nullable=True)
    ship = db.relationship('Ship', back_populates='passengers')
    user = db.relationship('User', back_populates='passengers')

    def __repr__(self):
        return f'<Passenger {self.ticket_number}>'

class Ship(db.Model):
    __tablename__ = 'ships'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    capacity_weight = db.Column(db.Float, nullable=False)
    current_weight = db.Column(db.Float, default=0.0)
    total_tickets = db.Column(db.Integer, nullable=False)
    available_tickets = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    port_from_id = db.Column(db.Integer, db.ForeignKey('ports.id'), nullable=False)
    port_to_id = db.Column(db.Integer, db.ForeignKey('ports.id'), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    contractor_id = db.Column(db.Integer, db.ForeignKey('contractors.id'), nullable=False)
    passengers = db.relationship('Passenger', back_populates='ship')
    port_from = db.relationship('Port', foreign_keys=[port_from_id], back_populates='ships_departing')
    port_to = db.relationship('Port', foreign_keys=[port_to_id], back_populates='ships_arriving')
    contractor = db.relationship('Contractor', back_populates='ships')
    transactions = db.relationship('Transaction', back_populates='ship')

    def __repr__(self):
        return f'<Ship {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'capacity_weight': self.capacity_weight,
            'current_weight': self.current_weight,
            'total_tickets': self.total_tickets,
            'price': self.price,
            'available_tickets': self.available_tickets,
            'category': self.category,
            'port_from': {
                'id': self.port_from.id,
                'name': self.port_from.name,
            },
            'port_to': {
                'id': self.port_to.id,
                'name': self.port_to.name,
            },
            'contractor_id': self.contractor_id
        }

class Port(db.Model, SerializerMixin):
    __tablename__ = "ports"
    serialize_rules = ('-ships_departing.port_from', '-ships_arriving.port_to')
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String)
    ships_departing = db.relationship('Ship', foreign_keys=[Ship.port_from_id], back_populates='port_from')
    ships_arriving = db.relationship('Ship', foreign_keys=[Ship.port_to_id], back_populates='port_to')

    def __repr__(self):
        return f'<Port {self.name}>'

class Contractor(db.Model, SerializerMixin):
    __tablename__ = "contractors"
    serialize_rules = ('-ships.contractor',)
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    specialization = db.Column(db.String)
    contact_info = db.Column(db.String)
    ships = db.relationship('Ship', back_populates='contractor')

    def __repr__(self):
        return f'<Contractor {self.name}>'

class Package(db.Model, SerializerMixin):
    __tablename__ = 'packages'
    id = db.Column(db.Integer, primary_key=True)
    ship_id = db.Column(db.Integer, db.ForeignKey('ships.id'), nullable=False)
    destination = db.Column(db.String)
    price = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String)
    weight = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Package {self.destination}>'

class UserShipAssociation(db.Model, SerializerMixin):
    __tablename__ = 'user_ship_association'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ship_id = db.Column(db.Integer, db.ForeignKey('ships.id'), nullable=False)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    amount = db.Column(db.Integer)
    category = db.Column(db.String)
    ship_id = db.Column(db.Integer, db.ForeignKey('ships.id'))
    created_at = db.Column(db.DateTime, default=db.func.now())
    user = db.relationship('User', back_populates='transactions')
    ship = db.relationship('Ship', back_populates='transactions')

    def __repr__(self):
        return f'<Transaction {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': self.amount,
            'category': self.category,
            'ship_id': self.ship_id,
            'created_at': self.created_at,
            'ship': {
                'id': self.ship.id,
                'name': self.ship.name
            }
        }