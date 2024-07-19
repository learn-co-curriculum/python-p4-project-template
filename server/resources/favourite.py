
from flask_restful import Resource,Api,reqparse
from models import db, Favourite
from flask import Blueprint

favourite_bp = Blueprint('favourite',__name__,url_prefix='/favourite')
favourite_api = Api(favourite_bp)


favourite_parser = reqparse.RequestParser()
favourite_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
favourite_parser.add_argument('book_id', type=int, required=True, help='Book ID is required')
favourite_parser.add_argument('title', type=str, required=True, help='Book title is required')


class FavouriteResource(Resource):
    def get(self, id):
        favourite = Favourite.query.get_or_404(id)
        return favourite.serialize()

    def put(self, id):
        data = favourite_parser.parse_args()
        favourite = Favourite.query.get_or_404(id)
        favourite.user_id = data['user_id']
        favourite.book_id = data['book_id']
        favourite.title=data['title']
        db.session.commit()
        return favourite.serialize()

    def delete(self, id):
        favourite = Favourite.query.get_or_404(id)
        db.session.delete(favourite)
        db.session.commit()
        return {'message': 'Favourite record deleted successfully'}

class FavouriteListResource(Resource):
    def get(self):
        favourites = Favourite.query.all()
        return [favourite.serialize() for favourite in favourites]

    def post(self):
        data = favourite_parser.parse_args()
        new_favourite = Favourite(user_id=data['user_id'], book_id=data['book_id'],title=data.get('title'))
        db.session.add(new_favourite)
        db.session.commit()
        return new_favourite.serialize(), 201

favourite_api.add_resource(FavouriteResource, '/<int:id>')
favourite_api.add_resource(FavouriteListResource, '/favouritelist')

#localhost:5555/favourite/1
#localhost:5555/favourite/favouritelist