from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Booking

booking_bp = Blueprint('bookings', __name__, url_prefix='/bookings')

@booking_bp.route('/', methods=['POST'])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    booking = Booking(
        stay_id=data['stay_id'],
        user_id=user_id,
        start_date=data['start_date'],
        end_date=data['end_date'],
        note=data.get('note', '')
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking.to_dict()), 201

@booking_bp.route('/', methods=['GET'])
@jwt_required()
def user_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([b.to_dict() for b in bookings])