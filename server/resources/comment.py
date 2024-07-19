
from flask_restful import Resource,Api,reqparse
from models import db, Comment
from flask import Blueprint

comment_bp = Blueprint('comment',__name__,url_prefix='/comment')
comment_api = Api(comment_bp)


comment_parser = reqparse.RequestParser()
comment_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
comment_parser.add_argument('book_id', type=int, required=True, help='Book ID is required')
comment_parser.add_argument('text', type=str, required=True, help='Text is required')
comment_parser.add_argument('name', type=str, required=False, help='Name of the commenter (default is Anonymous)')


class CommentResource(Resource):
    def get(self, id):
        comment = Comment.query.get_or_404(id)
        return comment.serialize()

    def put(self, id):
        data = comment_parser.parse_args()
        comment = Comment.query.get_or_404(id)
        comment.user_id = data['user_id']
        comment.book_id = data['book_id']
        comment.text = data['text']
        comment.name=data['name']
        db.session.commit()
        return comment.serialize()

    def delete(self, id):
        comment = Comment.query.get_or_404(id)
        db.session.delete(comment)
        db.session.commit()
        return {'message': 'Comment deleted successfully'}

class CommentListResource(Resource):
    def get(self):
        comments = Comment.query.all()
        return [comment.serialize() for comment in comments]

    def post(self):
        data = comment_parser.parse_args()
        new_comment = Comment(user_id=data['user_id'], book_id=data['book_id'], text=data['text'])
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.serialize(), 201

comment_api.add_resource(CommentResource, '/<int:id>')
comment_api.add_resource(CommentListResource, '/commentlist')

#localhost:5555/comment/1
#localhost:5555/comment/commentlist