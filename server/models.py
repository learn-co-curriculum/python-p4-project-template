from config import api, app, bcrypt, db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin


# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    memberships = db.relationship(
        "Membership", back_populates="user", cascade="all, delete-orphan"
    )

    book_clubs = association_proxy("memberships", "book_club")

    serialize_rules = ("-memberships.user", "-_password_hash")

    @validates("username")
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        if len(username) > 100:
            raise ValueError("Username cannot exceed 100 characters")
        return username

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password is not readable")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

    def __init__(self, username, password):
        self.username = username
        self.password_hash = password


class Membership(db.Model, SerializerMixin):
    __tablename__ = "memberships"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    book_club_id = db.Column(
        db.Integer, db.ForeignKey("book_clubs.id", ondelete="CASCADE"), nullable=False
    )
    user = db.relationship("User", back_populates="memberships")
    book_club = db.relationship("BookClub", back_populates="memberships")

    serialize_rules = ("-user.memberships", "-book_club.memberships")


class BookClub(db.Model, SerializerMixin):
    __tablename__ = "book_clubs"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    memberships = db.relationship(
        "Membership", back_populates="book_club", cascade="all, delete-orphan"
    )
    assignments = db.relationship(
        "Assignment",
        back_populates="book_club",
        cascade="all, delete-orphan",
        overlaps="book_clubs,books",
    )
    books = db.relationship(
        "Book",
        secondary="assignments",
        back_populates="book_clubs",
        overlaps="assignments,book_clubs",
    )

    users = association_proxy("memberships", "user")

    serialize_rules = (
        "-memberships.book_club",
        "-assignments.book_club",
        "-assignments.book",
        "-books",
    )

    def __repr__(self):
        return f"<BookClub(id={self.id}, name='{self.name}', description='{self.description[:20]}')>"

    def __init__(self, name, description):
        self.name = name
        self.description = description


class Book(db.Model, SerializerMixin):
    __tablename__ = "books"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))

    assignments = db.relationship(
        "Assignment", back_populates="book", overlaps="book_clubs,books"
    )
    book_clubs = db.relationship(
        "BookClub",
        secondary="assignments",
        back_populates="books",
        overlaps="assignments,books",
    )

    serialize_rules = ("-assignments.book", "-book_clubs.books")

    def __repr__(self):
        return f"<Book(id={self.id}, title='{self.title}', author='{self.author}')>"


class Assignment(db.Model, SerializerMixin):
    __tablename__ = "assignments"
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    book_club_id = db.Column(db.Integer, db.ForeignKey("book_clubs.id"), nullable=False)

    __table_args__ = (db.UniqueConstraint('book_id', 'book_club_id', name='_book_club_assignment_uc'),)

    book = db.relationship(
        "Book", back_populates="assignments", overlaps="book_clubs,books"
    )
    book_club = db.relationship(
        "BookClub", back_populates="assignments", overlaps="book_clubs,books"
    )

    serialize_rules = ("-book.assignments", "-book_club.assignments")

    def __repr__(self):
        return f"<Assignment(id={self.id}, book_id={self.book_id}, book_club_id={self.book_club_id})>"
