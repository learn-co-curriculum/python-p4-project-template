from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Review

review_bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@review_bp.route('/', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.get_json()
    review = Review(
        stay_id=data['stay_id'],
        user_id=user_id,
        rating=data['rating'],
        comment=data.get('comment', '')
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201

@review_bp.route('/stay/<int:stay_id>', methods=['GET'])
def get_reviews_for_stay(stay_id):
    reviews = Review.query.filter_by(stay_id=stay_id).all()
    return jsonify([r.to_dict() for r in reviews])
