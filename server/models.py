from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import validates


from config import db, bcrypt
import re


friendship_table = db.Table('friendships', db.metadata,
    db.Column('user_id', db.ForeignKey('users.id', ondelete="CASCADE"), primary_key=True),
    db.Column('friend_id', db.ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
)

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
        if len(value) < 5:
            raise ValueError('password must be atleast 5 characters')
        self._hashed_password = bcrypt.generate_password_hash(value).decode('utf-8')
    
    def authenticate(self, password_to_check):
        return bcrypt.check_password_hash(self._hashed_password, password_to_check)
    
    # Validations
    @validates('username')
    def validates_username(self, key, value):
        if bool(re.match(r'^[a-zA-Z]',value)) == False:
            raise ValueError('username must start with a letter')
        elif len(value) < 5:
            raise ValueError('username must be atleast 5 characters')
        else:
            return value
    

    # Relationships
    transactions_sent = db.relationship('Transaction', foreign_keys='Transaction.requestor', back_populates='sender')
    transactions_received = db.relationship('Transaction', foreign_keys='Transaction.requestee', back_populates='receiver')
    friends_sent = db.relationship('FriendRequest', foreign_keys='FriendRequest.invitor_id', back_populates='invitor')
    friends_received = db.relationship('FriendRequest', foreign_keys='FriendRequest.invitee_id', back_populates='invitee')

    friends = db.relationship(
        'User',
        secondary=friendship_table,
        primaryjoin=(friendship_table.c.user_id == id),
        secondaryjoin=(friendship_table.c.friend_id == id),
        back_populates='befriended_by'
    )
    befriended_by = db.relationship(
        'User',
        secondary=friendship_table,
        primaryjoin=(friendship_table.c.friend_id == id),
        secondaryjoin=(friendship_table.c.user_id == id),
        back_populates='friends'
    )

    # Serialize rules
    serialize_rules = ('-transactions_sent.sender', '-transactions_received.receiver', '-_hashed_password', '-friends_sent.invitor', '-friends_received.invitee', '-friends.befriended_by', '-befriended_by.friends','-friends.friends','-befriended_by.befriended_by')


    def __repr__(self):
        return f"<User {self.username}>"

class Transaction(db.Model, SerializerMixin):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    requestor = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    requestee = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default='pending')

    # Relationships
    sender = db.relationship('User', 
                             foreign_keys=[requestor], 
                             back_populates='transactions_sent')
                             
    receiver = db.relationship('User', 
                               foreign_keys=[requestee], 
                               back_populates='transactions_received')
    
    def __repr__(self):
        return f"<Transaction from {self.sender.username} to {self.receiver.username}, amount: {self.amount}, description: {self.description}>"

    # Serialize rules
    serialize_rules = ('-sender', '-receiver')
    @validates('requestor')
    def validates_requestor(self, key, value):
        if not value:
            return ValueError('Requestor must be present')
        else:
            return value
        
    @validates('requestee')
    def validates_requestor(self, key, value):
        if not value:
            return ValueError('Requestee must be present')
        else:
            return value
    
    @validates('amount')
    def validates_amount(self, key, value):
        if value <=0:
            return ValueError('Amount must be greater than $0')
        else:
            return value

    @validates('payment_method')
    def validates_payment_method(self, key, value):
        if not value :
            return ValueError('Payment method must be provided')
        else:
            return value

    @validates('description')
    def validates_description(self, key, value):
        if len(value) not in range(1, 21):
            return ValueError('Descrpition length out of range')
        else:
            return value

## FRIEND REQUEST MODEL ###############################################################################################
class FriendRequest(db.Model, SerializerMixin):
    __tablename__ = 'friend_requests'

    id = db.Column(db.Integer, primary_key=True)
    invitor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    invitee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String, default='pending')

    # Relationships
    invitor = db.relationship('User', foreign_keys=[invitor_id], back_populates='friends_sent')
    invitee = db.relationship('User', foreign_keys=[invitee_id], back_populates='friends_received')
    
    # Serialize rules
    # serialize_rules = ('invitor', 'invitee')
    
    # serialize_rules = ('-invitor.friends_sent', 'invitor.friends_received', '-invitee.friends_received', 'invitee.friends_sent', '-invitor.transactions_sent', '-invitor.transactions_received')

    serialize_only = ('id','invitor_id', 'invitee_id', 'status', 'invitor.username', 'invitee.username')

    def __repr__(self):
        return f"<Friend request from {self.invitor} to {self.invitee}>"
    
## END FRIEND REQUEST MODEL ###############################################################################################


    