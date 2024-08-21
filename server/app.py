#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User, Transaction, FriendRequest

from sqlalchemy import func, and_

# Views go here!


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


# Signup
@app.post('/signup')
def create_user():
    data = request.json
    try:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            return {'error': 'Username already exists'}, 400
        
        new_user = User(username=data['username'])
        new_user.password = data['password']
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id  # SETTING COOKIE
        return new_user.to_dict(), 201
    except Exception as e:
        return {'error': str(e)}, 404
    

# Check session
@app.get('/check_session')
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.where(User.id == user_id).first()
        return user.to_dict(), 200
    else:
        return {}, 204
    

# Login/logout
@app.post('/login')
def login():
    data = request.json
    user = User.query.where(User.username == data['username']).first()
    if user and user.authenticate(data['password']):  # returns true or false
        session['user_id'] = user.id
        return user.to_dict(), 201
    else:
        return {'error': 'Invalid username or password'}, 401


@app.delete('/logout')
def logout():
    session.pop('user_id')
    return {}, 204


# Who does the user owe?
@app.get('/debits')
def get_debits():
    debits = (
        db.session.query(Transaction, User.username)
        .join(User, Transaction.requestor == User.id)
        .where(
            and_(
                Transaction.requestee == session.get('user_id'),
                Transaction.payment_method == 'request'
            )
        ).all()
    )
    
    result = [
        {
            'id': transaction.id,
            'requestor': transaction.requestor,
            'requestor_username': username,
            'requestee': transaction.requestee,
            'amount': transaction.amount,
            'year': transaction.year,
            'description':transaction.description
        }
        for transaction, username in debits
    ]
    
    return result, 200


# Who owes the user?
@app.get('/credits')
def get_credits():
    credits = (
        db.session.query(Transaction, User.username)
        .join(User, Transaction.requestee == User.id)
        .where(
            and_(
                Transaction.requestor == session.get('user_id'),
                Transaction.payment_method == 'request'
            )
        )
        .all()
    )
    result = [
        {
            'id': transaction.id,
            'requestor': transaction.requestor,
            'requestee': transaction.requestee,
            'requestee_username': username,
            'amount': transaction.amount,
            'year': transaction.year  ,
            'description':transaction.description
        }
        for transaction, username in credits
    ]
    
    return result, 200

@app.get('/payments')
def get_payments():
    # payments = Transaction.query.where(
    #     and_(
    #         Transaction.payment_method == 'payment',
    #         Transaction.requestee == session.get('user_id')
    #     )).all()
    # return [payment.to_dict() for payment in payments]

    payments = (
        db.session.query(Transaction, User.username)
        .join(User, Transaction.requestor == User.id)
        .where(
            and_(
                Transaction.payment_method == 'payment',
                    Transaction.requestee == session.get('user_id')
                )).all()

            )
    result = [
        {
            'id':transaction.id,
            'requestor':transaction.requestor,
            'requestor_username': username,
            'requestee': transaction.requestee,
            'amount': transaction.amount,
            'year': transaction.year,
            'description':transaction.description

        }
        for transaction, username in payments
    ]
    return result, 200



@app.get('/users')
def get_users():
    all_users = User.query.all()
    return [user.to_dict() for user in all_users]



@app.post('/request')
def add_transaction():
    try:
        data = request.json
        new_transaction = Transaction(
            requestor=session.get('user_id'),
            requestee=data['requestee'],
            amount=data['amount'],
            year=data['year'],
            payment_method=data['payment_method'],
            description=data['description']
        )
        db.session.add(new_transaction)
        db.session.commit()
        return new_transaction.to_dict(), 201
    except Exception as e:

        return {'error':str(e)}, 404

@app.delete('/request')
def make_request():
    data = request.json
    payment = Transaction.query.where(data['id'] == Transaction.id).first()
    db.session.delete(payment)
    db.session.commit()
    return {}, 204

@app.delete('/payment')
def make_payment():
    data = request.json
    payment = Transaction.query.where(data['id'] == Transaction.id).first()
    if not payment:
        return {'error': 'No payment ID provided'}, 400
    else:
        db.session.delete(payment)
        db.session.commit()
        return {}, 204

@app.get('/api/stats')
def get_stats():
    user_id = session.get('user_id')
    if not user_id:
        return {'error': 'Unauthorized'}, 401

    # 1. Total transactions
    total_transactions = Transaction.query.filter(
        (Transaction.requestor == user_id) | (Transaction.requestee == user_id)
    ).count()

    # 2. Transactions as sender
    transactions_as_sender = Transaction.query.filter(Transaction.requestor == user_id).count()

    # 3. Transactions as receiver
    transactions_as_receiver = Transaction.query.filter(Transaction.requestee == user_id).count()

    # 4. Transaction partners
    transaction_partners = db.session.query(
        User.id,
        User.username,
        func.count(Transaction.id).label('transaction_count'),
        func.sum(case(
            (Transaction.requestor == user_id, -Transaction.amount),
            else_=Transaction.amount
        )).label('total_amount')
    ).join(
        Transaction,
        or_(Transaction.requestor == User.id, Transaction.requestee == User.id)
    ).filter(
        and_(User.id != user_id, or_(Transaction.requestor == user_id, Transaction.requestee == user_id))
    ).group_by(User.id).all()

    # 5. Most active transaction partner
    most_active_partner = max(transaction_partners, key=lambda x: x.transaction_count)

    # 6 & 7. Yearly transaction summary
    yearly_transactions = db.session.query(
        Transaction.year,
        func.sum(case((Transaction.requestor == user_id, Transaction.amount), else_=0)).label('credit'),
        func.sum(case((Transaction.requestee == user_id, Transaction.amount), else_=0)).label('debit')
    ).filter(
        or_(Transaction.requestor == user_id, Transaction.requestee == user_id)
    ).group_by(Transaction.year).all()

    return {
        'totalTransactions': total_transactions,
        'transactionsAsSender': transactions_as_sender,
        'transactionsAsReceiver': transactions_as_receiver,
        'transactionPartners': [{
            'userId': partner.id,
            'username': partner.username,
            'transactionCount': partner.transaction_count,
            'totalAmount': float(partner.total_amount)
        } for partner in transaction_partners],
        'mostActivePartner': {
            'userId': most_active_partner.id,
            'username': most_active_partner.username,
            'transactionCount': most_active_partner.transaction_count,
            'totalAmount': float(most_active_partner.total_amount)
        },
        'yearlyTransactions': [{
            'year': year,
            'credit': float(credit),
            'debit': float(debit)
        } for year, credit, debit in yearly_transactions]
    }, 200

## FRIEND REQUESTS ##############################################################################################################################

@app.post('/friend_requests')
def send_friend_request():
    data = request.json
    receiver_id = data.get('receiver_id')
    sender_id = session.get('user_id')
    
    
    if not sender_id:
        return {'error': "You must be logged in to perform this action"}, 401
    
    if sender_id == receiver_id:
        return {'error': "You can't be friends with yourself!"}, 400
    
    existing_request = FriendRequest.query.filter_by(invitor_id=sender_id, invitee_id=receiver_id, status='pending').first()

    if existing_request:
        return {'error': 'Request already sent!'}, 400
    
    new_request = FriendRequest(invitor_id=sender_id, invitee_id=receiver_id, status='pending')
    db.session.add(new_request)
    db.session.commit()
    
    return new_request.to_dict(), 201
    # return data, 201

@app.get('/friend_requests')
def get_friend_requests():
    user_id = session.get('user_id')
    if not user_id:
        return {'error': "You must be logged in to perform this action"}, 401
    
    received_requests = FriendRequest.query.filter_by(invitee_id=user_id, status='pending').all()

    return [request.to_dict() for request in received_requests], 200

@app.patch('/friend_request/<int:request_id>')
def respond_to_friend_request(request_id):
    user_id = session.get('user_id')
    if not user_id:
        return {'error': "You must be logged in to perform this action"}, 401
    
    data = request.json
    action = data.get('action')

    if action not in ['accept', 'reject']:
        return {'error': 'Invalid action. Must be "accept" or "reject"'}, 400

    friend_request = FriendRequest.query.get(request_id)

    if not friend_request or friend_request.invitee_id != user_id:
        return {'error': 'Friend request not found'}, 404

    friend_request.status = 'accepted' if action == 'accept' else 'rejected'
    
    if friend_request.status == 'accepted':
        # Get both users
        user = User.query.get(user_id)
        friend = User.query.get(friend_request.invitor_id)
        
        # Add the friendship relationship
        user.friends.append(friend)
        friend.friends.append(user)
        
        db.session.add(user)
        db.session.add(friend)
    
    db.session.commit()

    return friend_request.to_dict(), 200

@app.get('/friends')
def get_friends():
    user_id = session.get('user_id')
    if not user_id:
        return {'error': "You must be logged in to perform this action"}, 401
    
    user = User.query.get(user_id)
    if not user:
        return {'error': "User not found"}, 404

    friends = user.friends
    
    return [friend.to_dict() for friend in friends], 200

## END FRIEND REQUESTS ###############################################################################################################################################

if __name__ == '__main__':
    app.run(port=5555, debug=True)