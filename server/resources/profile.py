from flask_restful import Resource,Api,reqparse
from models import db, Profile
from flask import Blueprint

profile_bp = Blueprint('profile',__name__,url_prefix='/profile')
profile_api = Api(profile_bp)

profile_parser = reqparse.RequestParser()
profile_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
profile_parser.add_argument('bio', type=str, required=False)
profile_parser.add_argument('avatar', type=str, required=False)
profile_parser.add_argument('name', type=str, required=False) 
class ProfileResource(Resource):
    def get(self, id):
        profile = Profile.query.get_or_404(id)
        return profile.serialize()

    def put(self, id):
        data = profile_parser.parse_args()
        profile = Profile.query.get_or_404(id)
        profile.bio = data['bio']
        profile.avatar = data['avatar']
        profile.name=data['name']
        db.session.commit()
        return profile.serialize()

    def delete(self, id):
        profile = Profile.query.get_or_404(id)
        db.session.delete(profile)
        db.session.commit()
        return {'message': 'Profile deleted successfully'}

class ProfileListResource(Resource):
    def get(self):
        profiles = Profile.query.all()
        return [profile.serialize() for profile in profiles]

    def post(self):
        data = profile_parser.parse_args()
        new_profile = Profile(user_id=data['user_id'], bio=data['bio'], avatar=data['avatar'])
        db.session.add(new_profile)
        db.session.commit()
        return new_profile.serialize(), 201

profile_api.add_resource(ProfileResource, '/<int:id>')
profile_api.add_resource(ProfileListResource, '/profilelist')

#localhost:5555/profile/1
#localosht:5555/profile/profilelist