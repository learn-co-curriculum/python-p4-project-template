from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Favorite, Stay, User
from datetime import datetime

favorite_bp = Blueprint('favorites', __name__, url_prefix='/favorites')

@favorite_bp.route('/', methods=['POST'])
@jwt_required()
def add_favorite():
    """Add a stay to user's favorites"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    stay_id = data.get('stay_id')
    notes = data.get('notes', '')
    
    if not stay_id:
        return jsonify({'error': 'Stay ID is required'}), 400
        
    # Check if stay exists
    stay = Stay.query.get(stay_id)
    if not stay:
        return jsonify({'error': 'Stay not found'}), 404
        
    # Check if already favorited
    existing = Favorite.query.filter_by(user_id=user_id, stay_id=stay_id).first()
    if existing:
        return jsonify({'error': 'Stay already in favorites'}), 400
    
    favorite = Favorite(
        user_id=user_id,
        stay_id=stay_id,
        notes=notes,
        date_added=datetime.utcnow()
    )
    
    db.session.add(favorite)
    db.session.commit()
    
    return jsonify(favorite.to_dict()), 201

@favorite_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_favorites():
    """Get all favorites for current user"""
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    
    result = []
    for fav in favorites:
        fav_dict = fav.to_dict()
        fav_dict['stay'] = fav.stay.to_dict() if fav.stay else None
        result.append(fav_dict)
    
    return jsonify(result)

@favorite_bp.route('/<int:favorite_id>', methods=['PATCH'])
@jwt_required()
def update_favorite_notes():
    """Update notes for a favorite (user submittable attribute)"""
    user_id = get_jwt_identity()
    favorite = Favorite.query.get_or_404(favorite_id)
    
    if favorite.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    if 'notes' in data:
        favorite.notes = data['notes']
        db.session.commit()
    
    return jsonify(favorite.to_dict())

@favorite_bp.route('/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite():
    """Remove a stay from favorites"""
    user_id = get_jwt_identity()
    favorite = Favorite.query.get_or_404(favorite_id)
    
    if favorite.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({'message': 'Favorite removed successfully'})

@favorite_bp.route('/check/<int:stay_id>', methods=['GET'])
@jwt_required()
def check_favorite_status():
    """Check if a stay is favorited by current user"""
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(user_id=user_id, stay_id=stay_id).first()
    
    return jsonify({
        'is_favorited': favorite is not None,
        'favorite_id': favorite.id if favorite else None,
        'notes': favorite.notes if favorite else None
    })
