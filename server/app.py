#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User, Transaction

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
        .filter(Transaction.requestee == session['user_id'])
        .all()
    )
    
    result = [
        {
            'id': transaction.id,
            'requestor': transaction.requestor,
            'requestor_username': username,
            'requestee': transaction.requestee,
            'amount': transaction.amount,
            'year': transaction.year  
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
        .where(Transaction.requestor == session['user_id'])
        .all()
    )
    result = [
        {
            'id': transaction.id,
            'requestor': transaction.requestor,
            'requestee': transaction.requestee,
            'requestee_username': username,
            'amount': transaction.amount,
            'year': transaction.year  
        }
        for transaction, username in credits
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
            requestor=data['requestor'],
            requestee=data['requestee'],
            amount=data['amount'],
            year=data['year']
        )
        db.session.add(new_transaction)
        db.session.commit()
        return new_transaction.to_dict(), 201
    except Exception as e:

        return {'error':str(e)}, 404

@app.delete('/payment')
def make_payment():
    data = request.json
    payment = Transaction.query.where(data['id'] == Transaction.id).first()
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


if __name__ == '__main__':
    app.run(port=5555, debug=True)
