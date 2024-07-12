#!/usr/bin/env python3

import requests, random
from config import api, app, bcrypt, db, environ
from flask import request, session
from flask_restful import Resource

# Importing models
from models import Assignment, Book, BookClub, Membership, User
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

app.secret_key = "your_secret_key_here"
api_key = environ.get("YOUR_API_KEY")



@app.route("/")
def index():
    return "<h1>Project Server</h1>"


if __name__ == "__main__":
    app.run(port=5555, debug=True)

# ********
# User
# ********


class SignUp(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        try:
            user = User(username=username, password=password)
            db.session.add(user)
            db.session.commit()
            session["user_id"] = user.id
            return user.to_dict(), 201
        except IntegrityError as e:
            db.session.rollback()
            return {"errors": [str(e)]}, 422


class LogIn(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session["user_id"] = user.id
            return user.to_dict(), 200
        return {"errors": ["Invalid username or password"]}, 401


class LogOut(Resource):
    def delete(self):
        session.pop("user_id", None)
        return "", 204


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
        return {"error": "User not found"}, 401


class UpdateUser(Resource):
    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        if "username" in data:
            user.username = data["username"]
        if "password" in data:
            user.password_hash = data["password"]
        db.session.commit()
        return {"message": "User updated successfully"}, 200


# ********
# BookClub
# ********


class BookClubList(Resource):
    def post(self):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        new_club = BookClub(name=name, description=description)
        db.session.add(new_club)
        db.session.commit()
        return new_club.to_dict(), 201

    def get(self):
        book_clubs = BookClub.query.all()
        return [club.to_dict() for club in book_clubs], 200


class BookClubDetail(Resource):

    def get(self, club_id):
        club = BookClub.query.get_or_404(club_id)
        return club.to_dict(), 200

    def put(self, club_id):
        club = BookClub.query.get_or_404(club_id)
        data = request.get_json()
        if "name" in data:
            club.name = data["name"]
        if "description" in data:
            club.description = data["description"]
        db.session.commit()
        return club.to_dict(), 200

    def delete(self, club_id):
        club = BookClub.query.get_or_404(club_id)
        db.session.delete(club)
        db.session.commit()
        return "", 204


# ********
# Book
# ********
class BookList(Resource):
    def post(self):
        data = request.get_json()
        title = data.get("title")
        author = data.get("author")
        description = data.get("description")
        image_url = data.get("image_url")
        new_book = Book(
            title=title, author=author, description=description, image_url=image_url
        )
        db.session.add(new_book)
        db.session.commit()
        return new_book.to_dict(), 201

    def get(self):
        books = Book.query.all()
        return [book.to_dict() for book in books], 200


class BookDetail(Resource):
    def get(self, book_id):
        book = Book.query.get_or_404(book_id)
        return book.to_dict(), 200

    def put(self, book_id):
        book = Book.query.get_or_404(book_id)
        data = request.get_json()
        if "title" in data:
            book.title = data["title"]
        if "author" in data:
            book.author = data["author"]
        if "description" in data:
            book.description = data["description"]
        if "image_url" in data:
            book.image_url = data["image_url"]
        db.session.commit()
        return book.to_dict(), 200
    
    # def delete(self, book_id):
    #     book = Book.query.get_or_404(book_id)
    #     db.session.delete(book)
    #     db.session.commit()
    #     return "", 204


# ********
# Membership
# ********


class MembershipList(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        club_id = data.get("club_id")
        new_membership = Membership(user_id=user_id, book_club_id=club_id)
        db.session.add(new_membership)
        db.session.commit()
        return new_membership.to_dict(), 201

    def get(self):
        user = User.query.get(session.get("user_id"))
        if user:

            memberships = user.memberships
            return [membership.to_dict() for membership in memberships], 200


class MembershipDetail(Resource):
    def get(self, membership_id):
        membership = Membership.query.get_or_404(membership_id)
        return membership.to_dict(), 200

    def put(self, membership_id):
        membership = Membership.query.get_or_404(membership_id)
        data = request.get_json()
        if "user_id" in data:
            membership.user_id = data["user_id"]
        if "club_id" in data:
            membership.book_club_id = data["club_id"]
        db.session.commit()
        return membership.to_dict(), 200

    def delete(self, membership_id):
        if session.get("user_id"):
            book_club = BookClub.query.get_or_404(membership_id)
            membership = Membership.query.filter_by(
                user_id=session.get("user_id"), book_club_id=book_club.id
            ).first()
            if membership:
                db.session.delete(membership)
                db.session.commit()
                return "", 204
            else:
                return "", 404
        else:
            return "", 401


# ********
# Assignment
# ********
class AssignmentList(Resource):
    def post(self):
        data = request.get_json()
        book_id = data.get("book_id")
        club_id = data.get("club_id")
        
        if not book_id or not club_id:
            return {"message": "Both book_id and club_id are required"}, 400

        try:
            existing_assignment = Assignment.query.filter_by(book_id=book_id, book_club_id=club_id).first()
            if existing_assignment:
                return {"message": "Assignment already exists for this Book and Book Club"}, 400

            new_assignment = Assignment(book_id=book_id, book_club_id=club_id)
            db.session.add(new_assignment)
            db.session.commit()

            return new_assignment.to_dict(), 201

        except Exception as e:
            db.session.rollback()
            return {"message": "Internal Server Error"}, 500
        
    def get(self):
        assignments = Assignment.query.all()
        return [assignment.to_dict() for assignment in assignments], 200


class AssignmentDetail(Resource):
    def get(self, assignment_id):
        assignment = Assignment.query.get_or_404(assignment_id)
        return assignment.to_dict(), 200

    def put(self, assignment_id):
        assignment = Assignment.query.get_or_404(assignment_id)
        data = request.get_json()
        if "book_id" in data:
            assignment.book_id = data["book_id"]
        if "club_id" in data:
            assignment.book_club_id = data["club_id"]
        db.session.commit()
        return assignment.to_dict(), 200

    def delete(self, assignment_id):
        assignment = Assignment.query.get_or_404(assignment_id)
        db.session.delete(assignment)
        db.session.commit()
        return "", 204

class RecommendedBooks(Resource):
    def get(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {"error": "User not authenticated"}, 401

            assignments = Assignment.query.options(joinedload(Assignment.book)).join(Membership, Membership.book_club_id == Assignment.book_club_id)\
                .filter(Membership.user_id == user.id).all()

            if not assignments:
                return {"error": "User has no assigned books in any club"}, 400

            genres = set()
            book_name = ""
            for assignment in assignments:
                if assignment.book:
                    genres.add(assignment.book.description)
                    book_name = assignment.book.description

            if not genres:
                return {"error": "No genres found for assigned books"}, 400

            url = f'https://www.googleapis.com/books/v1/volumes?q={book_name}&maxResults=38&key={api_key}'

            response = requests.get(url)
            response.raise_for_status()

            data = response.json()

            if 'items' not in data or len(data['items']) == 0:
                return {"error": "No book data found in API response"}, 500
            
            random_book = random.choice(data['items'])
            volume_info = random_book['volumeInfo']
            title = volume_info.get('title', "")
            authors = ', '.join(volume_info.get('authors', []))
            description = volume_info.get('description', '')
            image_links = volume_info.get('imageLinks', {})
            small_thumbnail = image_links.get('smallThumbnail', '')
            thumbnail = image_links.get('thumbnail', '')

            # Check if the book already exists
            existing_book = Book.query.filter_by(title=title, author=authors).first()

            if not existing_book:
                # Save the recommended book to the books table
                recommended_book = Book(
                    title=title,
                    author=authors,
                    description=description,
                    image_url=thumbnail,
                )

                db.session.add(recommended_book)
                db.session.commit()
            else:
                recommended_book = existing_book

            return recommended_book.to_dict(), 201
        
        except requests.exceptions.RequestException as e:
            return {"error": f"Request to Google Books API failed: {str(e)}"}, 500

        except Exception as e:
            db.session.rollback()
            return {"error": f"Internal Server Error: {str(e)}"}, 500

# Adding resources to the API
api.add_resource(SignUp, "/signup")
api.add_resource(LogIn, "/login")
api.add_resource(LogOut, "/logout")
api.add_resource(CheckSession, "/check_session")
api.add_resource(UpdateUser, "/users/<int:user_id>")

api.add_resource(BookClubList, "/book_clubs")
api.add_resource(BookClubDetail, "/book_clubs/<int:club_id>")

api.add_resource(BookList, "/books")
api.add_resource(BookDetail, "/books/<int:book_id>")

api.add_resource(MembershipList, "/memberships")
api.add_resource(MembershipDetail, "/memberships/<int:membership_id>")

api.add_resource(AssignmentList, "/assignments")
api.add_resource(AssignmentDetail, "/assignments/<int:assignment_id>")

api.add_resource(RecommendedBooks, "/recommended-books/<int:user_id>")

