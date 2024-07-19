from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()  # Initialize db here

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    
    profile = db.relationship('Profile', uselist=False, back_populates='user', lazy=True)  # Single profile
    favourites = db.relationship('Favourite', back_populates='user', lazy=True)
    comments = db.relationship('Comment', back_populates='user', lazy=True)
    borrowed_books = db.relationship('BorrowedBook', back_populates='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password':self.password,
        }


class Profile(db.Model):
    __tablename__ = 'profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bio = db.Column(db.String(255))
    avatar = db.Column(db.String(255))
    name = db.Column(db.String(255), nullable=True)

    user = db.relationship('User', back_populates='profile')  # Back-reference

    def serialize(self):
        return {   
            'id': self.id,
            'user_id': self.user_id,
            'bio': self.bio,
            'avatar': self.avatar,
            'name': self.name,
        }


class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)  
    isbn = db.Column(db.String(20), nullable=True) 
    image = db.Column(db.String(255) ,nullable=False)
    #relationships
    comments = db.relationship('Comment', back_populates='book', lazy=True)
    favourites = db.relationship('Favourite', back_populates='book', lazy=True)
    borrowed_books = db.relationship('BorrowedBook', back_populates='book', lazy=True)
    bookdetail = db.relationship('BookDetail', back_populates='book', uselist=False)
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description':self.description,
            'isbn':self.isbn,
            'image': self.image
        }


class BookDetail(db.Model):
    __tablename__ = 'book_details'
    
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    genre = db.Column(db.String(100), nullable=True)
    publication_year = db.Column(db.Integer, nullable=True)
    
    book = db.relationship('Book', back_populates='bookdetail', uselist=False)  # Single book detail

    def serialize(self):
        return {
            'id': self.id,
            'book_id': self.book_id,
            'author': self.author,
            'title': self.title,
            'description': self.description,
            'genre': self.genre,
            'publication_year': self.publication_year,
        }





class BorrowedBook(db.Model):
    __tablename__ = 'borrowed_books'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    title = db.Column(db.String(255), nullable=True)
    borrowed_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime ,nullable=False)

    user = db.relationship('User', back_populates='borrowed_books')  # Relationship
    book = db.relationship('Book', back_populates='borrowed_books')  # Relationship

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'title': self.title,  
            'borrowed_date': self.borrowed_date.isoformat(),
            'return_date': self.return_date.isoformat() if self.return_date else None,
        }


class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False ,default='Anonymous') 
    
    user = db.relationship('User', back_populates='comments')  # Relationship
    book = db.relationship('Book', back_populates='comments')  # Relationship

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'text': self.text,
            'name':self.name,
        }


class Favourite(db.Model):
    __tablename__ = 'favourites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    
    #relationships
    user = db.relationship('User', back_populates='favourites')  # Relationship
    book = db.relationship('Book', back_populates='favourites')  # Relationship

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'title':self.title,
        }
