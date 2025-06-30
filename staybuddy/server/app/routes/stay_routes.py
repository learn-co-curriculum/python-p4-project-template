# server/app/routes/stay_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Stay, User  # assume Stay model exists

stay_bp = Blueprint('stays', __name__, url_prefix='/stays')

@stay_bp.route('/', methods=['GET'])
def get_stays():
    stays = Stay.query.all()
    return jsonify([stay.to_dict() for stay in stays])

@stay_bp.route('/<int:id>', methods=['GET'])
def get_stay(id):
    stay = Stay.query.get_or_404(id)
    return jsonify(stay.to_dict())

@stay_bp.route('/', methods=['POST'])
@jwt_required()
def create_stay():
    user_id = get_jwt_identity()
    data = request.get_json()
    stay = Stay(
        title=data['title'],
        location=data['location'],
        price=data['price'],
        description=data.get('description', ''),
        user_id=user_id
    )
    db.session.add(stay)
    db.session.commit()
    return jsonify(stay.to_dict()), 201

@stay_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_stay(id):
    stay = Stay.query.get_or_404(id)
    user_id = get_jwt_identity()
    if stay.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    for field in ['title', 'location', 'price', 'description']:
        if field in data:
            setattr(stay, field, data[field])
    db.session.commit()
    return jsonify(stay.to_dict())

@stay_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_stay(id):
    stay = Stay.query.get_or_404(id)
    user_id = get_jwt_identity()
    if stay.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(stay)
    db.session.commit()
    return jsonify({'message': 'Stay deleted'})