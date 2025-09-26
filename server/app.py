#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, send_from_directory, request, jsonify
from flask import send_from_directory
from flask_restful import Resource
import os
import uuid
import re
from datetime import datetime
from models import Owner, Property, Booking, PropertyImage, User ,Favorite # Add User here
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import app, db, api, allowed_file
from models import Owner, Property, Booking,PropertyImage, User

CORS(app) 


@app.route('/api/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return [property.to_dict() for property in properties]


@app.route('/api/properties/<int:id>', methods=['GET'])
def get_property(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    return property.to_dict()


@app.route('/api/bookings', methods=['POST'])
@jwt_required() 
def create_booking():
    from datetime import datetime
    
    data = request.get_json()
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if not current_user:
        return {"error": "User not found"}, 401
    # Basic validation
    if not all(k in data for k in ('property_id', 'check_in_date', 'check_out_date')):
    
        return {"error": "Missing required fields"}, 400
    
    
    # Calculate total price
    property = Property.query.get(data['property_id'])
    if not property:
        return {"error": "Property not found"}, 404
    
    from datetime import datetime
    check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
    check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
    days = (check_out - check_in).days
    total_price = property.price_per_night * days
    
    booking = Booking(
    property_id=data['property_id'],
    guest_name=current_user.name,    #
    guest_email=current_user.email,  
    check_in_date=check_in,
    check_out_date=check_out,
    total_price=total_price
)
    
    db.session.add(booking)
    db.session.commit()
    
    return booking.to_dict(), 201


# Owners endpoints
@app.route('/api/owners', methods=['GET'])
def get_owners():
    owners = Owner.query.all()
    return [owner.to_dict() for owner in owners]

@app.route('/api/owners', methods=['POST'])
def create_owner():
    data = request.get_json()
    
    if not all(k in data for k in ('name', 'email')):
        return {"error": "Name and email are required"}, 400
    
    owner = Owner(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone')
    )
    
    db.session.add(owner)
    db.session.commit()
    
    return owner.to_dict(), 201

# Complete Properties CRUD
@app.route('/api/properties', methods=['POST'])
def create_property():
    data = request.get_json()
    
    required_fields = ['name', 'description', 'location', 'price_per_night', 'max_guests', 'owner_id']
    if not all(k in data for k in required_fields):
        return {"error": "Missing required fields"}, 400
    
    property = Property(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        price_per_night=data['price_per_night'],
        max_guests=data['max_guests'],
        amenities=data.get('amenities', ''),
        owner_id=data['owner_id']
    )
    
    db.session.add(property)
    db.session.commit()
    
    return property.to_dict(), 201

@app.route('/api/properties/<int:id>', methods=['PATCH'])
def update_property(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(property, key, value)
    db.session.commit()
    return property.to_dict(), 200

# Bookings CRUD
@app.route('/api/bookings', methods=['GET'])
@jwt_required()  
def get_bookings():
    try:
        bookings = Booking.query.all()
        return [booking.to_dict() for booking in bookings]
    except Exception as e:
        return {"error": str(e)}, 500

@app.route('/api/bookings/<int:id>', methods=['PATCH'])
def update_booking(id):
    booking = Booking.query.get(id)
    if not booking:
        return {"error": "Booking not found"}, 404
    
    data = request.get_json()
    if 'booking_status' in data:
        booking.booking_status = data['booking_status']
    
    db.session.commit()
    return booking.to_dict()

# Property bookings
@app.route('/api/properties/<int:id>/bookings', methods=['GET'])
def get_property_bookings(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    
    return [booking.to_dict() for booking in property.bookings]

# Upload property images
@app.route('/api/properties/<int:property_id>/images', methods=['POST'])
def upload_property_images(property_id):
    property = Property.query.get(property_id)
    if not property:
        return {"error": "Property not found"}, 404
    
    if 'images' not in request.files:
        return {"error": "No images provided"}, 400
    
    files = request.files.getlist('images')
    uploaded_images = []
    
    for i, file in enumerate(files):
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            
            property_folder = os.path.join(app.config['UPLOAD_FOLDER'], str(property_id))
            os.makedirs(property_folder, exist_ok=True)
            
            file_path = os.path.join(property_folder, unique_filename)
            file.save(file_path)
            
            image_url = f"/uploads/properties/{property_id}/{unique_filename}"
            is_featured = i == 0 and PropertyImage.query.filter_by(property_id=property_id).count() == 0
            
            property_image = PropertyImage(
                property_id=property_id,
                image_url=image_url,
                image_name=unique_filename,
                is_featured=is_featured,
                upload_order=PropertyImage.query.filter_by(property_id=property_id).count()
            )
            
            db.session.add(property_image)
            uploaded_images.append(property_image)
    
    db.session.commit()
    return {"message": f"Uploaded {len(uploaded_images)} images", 
            "images": [img.to_dict() for img in uploaded_images]}, 201

# Get property images
@app.route('/api/properties/<int:property_id>/images', methods=['GET'])
def get_property_images(property_id):
    images = PropertyImage.query.filter_by(property_id=property_id).order_by(PropertyImage.upload_order).all()
    return [image.to_dict() for image in images]

# Delete specific image
@app.route('/api/properties/images/<int:image_id>', methods=['DELETE'])
def delete_property_image(image_id):
    image = PropertyImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    # Delete physical file
    file_path = os.path.join('uploads/properties', str(image.property_id), image.image_name)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    db.session.delete(image)
    db.session.commit()
    return {"message": "Image deleted successfully"}

# Serve uploaded files
@app.route('/uploads/properties/<int:property_id>/<filename>')
def uploaded_file(property_id, filename):
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], str(property_id)), filename)

# Email validation helper function
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@app.route('/api/register', methods=['POST'])
def register():
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        user_type = data.get('user_type', 'guest')  # Default to guest
        
        # Validation checks
        if not email or not password or not name:
            return jsonify({'error': 'Email, password, and name are required'}), 400
        
        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
            
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
            
        if len(name) < 2:
            return jsonify({'error': 'Name must be at least 2 characters long'}), 400
            
        if user_type not in ['guest', 'owner']:
            return jsonify({'error': 'Invalid user type'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Create new user
        new_user = User(
            email=email,
            name=name,
            user_type=user_type,
            created_at=datetime.utcnow()
        )
        new_user.set_password(password)
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=new_user.id)
        
        # Return success response
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'name': new_user.name,
                'user_type': new_user.user_type
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Get data from request
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        # Return success response
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'user_type': user.user_type
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed. Please try again.'}), 500
@app.route('/api/verify', methods=['GET'])
@jwt_required()
def verify():
    try:
        # Get current user ID from JWT token
        current_user_id = get_jwt_identity()
        
        # Find user by ID
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return success response with user info
        return jsonify({
            'message': 'Token is valid',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'user_type': user.user_type
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token verification failed'}), 401

@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    # Since JWT tokens are stateless, logout is mainly handled client-side
    # by removing the token from localStorage
    return jsonify({'message': 'Logout successful'}), 200

# Get Current User Profile Route
@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': current_user.id,
                'email': current_user.email,
                'name': current_user.name,
                'user_type': current_user.user_type,
                'created_at': current_user.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile'}), 500

# Update User Profile Route
@app.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update name if provided
        if 'name' in data:
            name = data['name'].strip()
            if len(name) >= 2:
                current_user.name = name
            else:
                return jsonify({'error': 'Name must be at least 2 characters long'}), 400
        
        # Update password if provided
        if 'password' in data:
            password = data['password']
            if len(password) >= 6:
                current_user.set_password(password)
            else:
                return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': current_user.id,
                'email': current_user.email,
                'name': current_user.name,
                'user_type': current_user.user_type
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500

# Error handler for JWT errors
@app.errorhandler(422)
def handle_unprocessable_entity(e):
    return jsonify({'error': 'Invalid token format'}), 422

@app.errorhandler(401)
def handle_unauthorized(e):
    return jsonify({'error': 'Token is invalid or expired'}), 401

@app.route('/api/properties/<int:id>', methods=['DELETE'])
def delete_property(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    
    
    for image in property.images:
        # Delete physical files if they exist
        file_path = os.path.join('uploads/properties', str(property.id), image.image_name)
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.session.delete(property)
    db.session.commit()
    return {"message": "Property deleted successfully"}, 200

@app.route('/api/properties/<int:property_id>/images/url', methods=['POST'])
def add_property_image_url(property_id):
    property = Property.query.get(property_id)
    if not property:
        return {"error": "Property not found"}, 404
    
    data = request.get_json()
    if not data or 'image_url' not in data:
        return {"error": "Image URL is required"}, 400
    
    property_image = PropertyImage(
        property_id=property_id,
        image_url=data['image_url'],
        image_name=data.get('image_name', 'custom_image.jpg'),
        is_featured=data.get('is_featured', False),
        upload_order=data.get('upload_order', 0)
    )
    
    db.session.add(property_image)
    db.session.commit()
    
    return property_image.to_dict(), 201

@app.route('/api/owners/<int:owner_id>/properties', methods=['GET'])
@jwt_required()
def get_owner_properties(owner_id):
    current_user_id = get_jwt_identity()
    
    
    # Make sure user can only access their own properties
    if current_user_id != owner_id:
        return {"error": "Unauthorized access"}, 403
    
    properties = Property.query.filter_by(owner_id=owner_id).all()
    return [property.to_dict() for property in properties]

@app.route('/api/bookings/<int:booking_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_booking(booking_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return {"error": "User not found"}, 401
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404
            
        # Check if user owns this booking
        if booking.guest_email != current_user.email:
            return {"error": "Unauthorized"}, 403
            
        booking.booking_status = "cancelled"
        db.session.commit()
        
        return booking.to_dict(), 200
    except Exception as e:
        return {"error": str(e)}, 500
    # Get bookings for current user (guest reservations)
@app.route('/api/user/bookings', methods=['GET'])
@jwt_required()
def get_user_bookings():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return {"error": "User not found"}, 401
            
        # Return bookings where guest_email matches current user
        bookings = Booking.query.filter_by(guest_email=current_user.email).all()
        return [booking.to_dict() for booking in bookings]
    except Exception as e:
        return {"error": str(e)}, 500

# Get bookings for owner's properties
@app.route('/api/owner/bookings', methods=['GET'])
@jwt_required()
def get_owner_bookings():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user or current_user.user_type != 'owner':
            return {"error": "Owner access required"}, 403
            
        # Get all properties owned by current user
        owner_properties = Property.query.filter_by(owner_id=current_user_id).all()
        property_ids = [p.id for p in owner_properties]
        
        # Get all bookings for those properties
        bookings = Booking.query.filter(Booking.property_id.in_(property_ids)).all()
        return [booking.to_dict() for booking in bookings]
    except Exception as e:
        return {"error": str(e)}, 500

# Get user favorites
@app.route('/api/user/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return {"error": "User not found"}, 401
        
        favorites = Favorite.query.filter_by(user_id=current_user_id).all()
        return [fav.to_dict() for fav in favorites]
    except Exception as e:
        return {"error": str(e)}, 500

# Add property to favorites  
@app.route('/api/user/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return {"error": "User not found"}, 401
            
        data = request.get_json()
        property_id = data.get('property_id')
        
        if not property_id:
            return {"error": "Property ID is required"}, 400
            
        # Check if property exists
        property = Property.query.get(property_id)
        if not property:
            return {"error": "Property not found"}, 404
            
        # Check if already favorited
        existing_favorite = Favorite.query.filter_by(
            user_id=current_user_id, 
            property_id=property_id
        ).first()
        
        if existing_favorite:
            return {"error": "Property already in favorites"}, 400
            
        # Create new favorite
        favorite = Favorite(
            user_id=current_user_id,
            property_id=property_id
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return favorite.to_dict(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

# Remove property from favorites
@app.route('/api/user/favorites/<int:property_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(property_id):
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        if not current_user:
            return {"error": "User not found"}, 401
            
        favorite = Favorite.query.filter_by(
            user_id=current_user_id, 
            property_id=property_id
        ).first()
        
        if not favorite:
            return {"error": "Favorite not found"}, 404
            
        db.session.delete(favorite)
        db.session.commit()
        
        return {"message": "Favorite removed successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

@app.route('/api/properties/available', methods=['POST'])
def get_available_properties():
    try:
        data = request.get_json()
        check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
        check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
        
        # Get all properties
        all_properties = Property.query.all()
        available_properties = []
        
        for property in all_properties:
            # Check if property has conflicting bookings
            conflicting_bookings = Booking.query.filter(
                Booking.property_id == property.id,
                Booking.booking_status == 'confirmed',
                ~((Booking.check_out_date <= check_in) | (Booking.check_in_date >= check_out))
            ).first()
            
            if not conflicting_bookings:
                available_properties.append(property)
        
        return [property.to_dict() for property in available_properties]
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(port=5555, debug=True)

