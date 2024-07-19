from flask_restful import Resource, Api, reqparse
from models import db, BookDetail
from flask import Blueprint
from flask_cors import CORS

bookdetail_bp = Blueprint('bookdetail', __name__, url_prefix='/bookdetail')
bookdetail_api = Api(bookdetail_bp)

bookdetail_parser = reqparse.RequestParser()
bookdetail_parser.add_argument('book_id', type=int, required=True, help='Book ID is required')
bookdetail_parser.add_argument('author', type=str, required=True, help='Author is required')
bookdetail_parser.add_argument('description', type=str, required=False, help='Description of the book (optional)')
bookdetail_parser.add_argument('genre', type=str, required=False, help='Genre of the book (optional)')
bookdetail_parser.add_argument('publication_year', type=int, required=False, help='Publication year of the book (optional)')
bookdetail_parser.add_argument('title', type=str, required=True, help='Title is required')

class BookDetailResource(Resource):
    def get(self, id):
        bookdetail = BookDetail.query.get_or_404(id)
        return bookdetail.serialize()

    def put(self, id):
        data = bookdetail_parser.parse_args()
        bookdetail = BookDetail.query.get_or_404(id)
        bookdetail.book_id = data['book_id']
        bookdetail.title = data['title'] 
        bookdetail.author = data['author']
        bookdetail.description = data.get('description')  # Update optional field
        bookdetail.genre = data.get('genre')  # Update optional field
        bookdetail.publication_year = data.get('publication_year')  # Update optional field
        db.session.commit()
        return bookdetail.serialize()

    def delete(self, id):
        book_detail = BookDetail.query.get_or_404(id)
        db.session.delete(book_detail)
        db.session.commit()
        return {'message': 'BookDetail deleted successfully'}

class BookDetailListResource(Resource):
    def get(self):
        book_details = BookDetail.query.all()
        return [book_detail.serialize() for book_detail in book_details]

    def post(self):
        data = bookdetail_parser.parse_args()
        new_bookdetail = BookDetail(
            book_id=data['book_id'],
            author=data['author'],
            title=data['title'],  # Include optional field
            description=data.get('description'),  # Include optional field
            genre=data.get('genre'),  # Include optional field
            publication_year=data.get('publication_year')  # Include optional field
        )
        db.session.add(new_bookdetail)
        db.session.commit()
        return new_bookdetail.serialize(), 201

bookdetail_api.add_resource(BookDetailResource, '/<int:id>')
bookdetail_api.add_resource(BookDetailListResource, '/bookdetaillist')

#localhost:5555/bookdetail/1
#localhost:5555/bookdetail/bookdetaillist
