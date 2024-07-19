from flask_restful import Resource, Api, reqparse, request
from models import db, BorrowedBook
from flask import Blueprint, jsonify
from datetime import datetime

borrowed_bp = Blueprint('borrowed', __name__, url_prefix='/borrowed')
borrowed_api = Api(borrowed_bp)

# Define request parser
borrowed_parser = reqparse.RequestParser()
borrowed_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
borrowed_parser.add_argument('book_id', type=int, required=True, help='Book ID is required')
borrowed_parser.add_argument('title', type=str, required=True, help='Book title is required')
borrowed_parser.add_argument('return_date', type=str, required=False, help='Return date in ISO format (optional)')
borrowed_parser.add_argument('borrowed_date', type=str, required=False, help='Borrowed date in ISO format (optional)')

class BorrowedBookResource(Resource):
    def get(self, id):
        borrowed = BorrowedBook.query.get_or_404(id)
        return borrowed.serialize()

    def post(self):
        data = request.get_json()

        user_id = data.get('user_id')
        book_id = data.get('book_id')
        title = data.get('title', 'untitled')
        borrowed_date_str = data.get('borrowed_date')
        return_date_str = data.get('return_date')

        try:
            borrowed_date = datetime.fromisoformat(borrowed_date_str) if borrowed_date_str else None
            return_date = datetime.fromisoformat(return_date_str) if return_date_str else None
        except ValueError:
            return jsonify({'message': 'Invalid date format'}), 400

        new_borrowed_book = BorrowedBook(
            user_id=user_id,
            book_id=book_id,
            title=title,
            borrowed_date=borrowed_date,
            return_date=return_date
        )

        db.session.add(new_borrowed_book)
        db.session.commit()

        return new_borrowed_book.serialize(), 201

    def put(self, id):
        data = borrowed_parser.parse_args()
        borrowed = BorrowedBook.query.get_or_404(id)
        
        borrowed.user_id = data['user_id']
        borrowed.book_id = data['book_id']
        borrowed.title = data.get('title', borrowed.title) 
        borrowed.return_date = datetime.fromisoformat(data['return_date']) if data['return_date'] else borrowed.return_date
        borrowed.borrowed_date = datetime.fromisoformat(data['borrowed_date']) if data['borrowed_date'] else borrowed.borrowed_date
        
        db.session.commit()
        return borrowed.serialize()

    def delete(self, id):
        borrowed = BorrowedBook.query.get_or_404(id)
        db.session.delete(borrowed)
        db.session.commit()
        return {'message': 'Borrowed book record deleted successfully'}

class BorrowedBookListResource(Resource):
    def get(self):
        borroweds = BorrowedBook.query.all()
        return [borrowed.serialize() for borrowed in borroweds]

    def post(self):
        data = borrowed_parser.parse_args()
        borrowed_date = datetime.fromisoformat(data['borrowed_date']) if data['borrowed_date'] else None
        return_date = datetime.fromisoformat(data['return_date']) if data['return_date'] else None

        new_borrowed = BorrowedBook(
            user_id=data['user_id'],
            book_id=data['book_id'],
            title=data['title'],
            borrowed_date=borrowed_date,
            return_date=return_date
        )

        db.session.add(new_borrowed)
        db.session.commit()
        return new_borrowed.serialize(), 201

borrowed_api.add_resource(BorrowedBookResource, '/<int:id>')
borrowed_api.add_resource(BorrowedBookListResource, '/borrowedlist')
#localhost:5555/borrowed_books/borrowedlist