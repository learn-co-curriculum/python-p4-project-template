#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api

# Model imports
from models import User, Transaction

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


#Signup
@app.post('/signup')
def create_user():
    data = request.json
    try:
        new_user = User(username = data['username'])
        new_user.password = data['password']
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id ##SETTING COOKIE
        return new_user.to_dict(), 201
    except Exception as e:
        return {'error':str(e)}, 404
    
#check session
@app.get('/check_session')
def check_session():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.where(User.id == user_id).first()
        return user.to_dict(), 200
    else:
        return {}, 204
    
#login/logout

@app.post('/login')
def login():
    data = request.json
    user = User.query.where(User.username == data['username']).first()
    if user and user.authenticate(data['password']): #returns true or false
        session['user_id'] = user.id
        return user.to_dict(), 201
    else:
        return {'error':'Invalid username or password'}, 401



@app.delete('/logout')
def logout():
    session.pop('user_id')
    return {}, 204



# Who does the user owe?
@app.get('/debits')
def get_debits():

    # Perform a join between Transaction and User to get the requestor's username
    debits = (
        db.session.query(Transaction, User.username) #query the Transaction table and the username column from the User table
        .join(User, Transaction.requestor == User.id) #first arg is the table from the joined column, second arg represents the joining
        .filter(Transaction.requestee == session['user_id']) #filter this joined table down to where the requestee matches the user logged in
        .all() #can test this w postman.  Have to send a put request to login
    )
    
    # Format the result to include the requestor's username in the transaction dictionary

    #Debits is now a list of tuples
    #[
    #     (Transaction(id=1, requestor=1, requestee=2, amount=50), 'mario'),
    #     (Transaction(id=2, requestor=2, requestee=1, amount=75), 'luigi'),
    # ]
    #transaction represents first value of tuple
    #username represents second value of tuple

    result = [
        {
            'id': transaction.id,
            'requestor': transaction.requestor,
            'requestor_username': username,
            'requestee': transaction.requestee,
            'amount': transaction.amount
        }
        for transaction, username in debits
    ]
    #result is a list of dictionaries created from tuples
    
    return result, 200
    # same concept for credits below

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
            'amount': transaction.amount
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
        new_transaction = Transaction(requestor=session['user_id'], amount=data['amount'], requestee = data['requestee'])
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



if __name__ == '__main__':
    app.run(port=5555, debug=True)


