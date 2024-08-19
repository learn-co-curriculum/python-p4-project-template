from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db, bcrypt

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _hashed_password = db.Column(db.String)

    @property
    def password(self):
        raise Exception('You may not view password')
    
    @password.setter
    def password(self, value):
        self._hashed_password = bcrypt.generate_password_hash(value).decode('utf-8')
    
    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._hashed_password, password_to_check)

    # Relationships
    transactions_sent = db.relationship('Transaction', foreign_keys='Transaction.requestor', back_populates='sender')

    transactions_received = db.relationship('Transaction', foreign_keys='Transaction.requestee', back_populates='receiver')

    # Serialize rules
    serialize_rules = ('-transactions_sent.sender', '-transactions_received.receiver', '-_hashed_password')

    def __repr__(self):
        return f"<User {self.username}>"

class Transaction(db.Model, SerializerMixin):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    requestor = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requestee = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)

    # Relationships
    sender = db.relationship('User', 
                             foreign_keys=[requestor], 
                             back_populates='transactions_sent')
                             
    receiver = db.relationship('User', 
                               foreign_keys=[requestee], 
                               back_populates='transactions_received')

    # Serialize rules
    serialize_rules = ('-sender', '-receiver')


    def __repr__(self):
        return f"<Transaction from {self.requestor} to {self.requestee}, amount: {self.amount}, year: {self.year}>"
