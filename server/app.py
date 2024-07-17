from flask import Flask, request, jsonify
from flask_restful import Resource
from flask_login import LoginManager
from auth import auth, login_manager  
from config import app, db, api  
from models import Owner, Vehicle, Rental, Feature  


app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'


login_manager.init_app(app)
login_manager.login_view = 'auth.login'




app.register_blueprint(auth, url_prefix='/auth')

@app.route('/')
def index():
    return '<h1>Backend Deluxe Motors Server</h1>'

def owner_to_dict(owner):
    return {
        'owner_id': owner.owner_id,
        'owner_name': owner.owner_name,
        'contact_info': owner.contact_info,
        'age': owner.age,
        'address': owner.address
    }

def vehicle_to_dict(vehicle):
    return {
        'vehicle_id': vehicle.vehicle_id,
        'make': vehicle.make,
        'model': vehicle.model,
        'car_image': vehicle.car_image,
        'year': vehicle.year,
        'price': vehicle.price,
        'description': vehicle.description,
        'owner_id': vehicle.owner_id,
        # 'features': feature_to_dict(vehicle.features) if vehicle.features else None
    }

def rental_to_dict(rental):
    return {
        'customer_name': rental.customer_name,
        'rental_id': rental.rental_id,
        'vehicle_id': rental.vehicle_id,
        'duration_days': rental.duration_days,
        'price': rental.price,
        'vehicle': vehicle_to_dict(rental.vehicle) if rental.vehicle else None
    }

def feature_to_dict(feature):
    return {
        'feature_id': feature.feature_id,
        'speed_km': feature.speed_km,
        'car_cc': feature.car_cc,
        'fuel_type': feature.fuel_type,
        'vehicle_id':feature.vehicle_id,
        'vehicles': vehicle_to_dict(feature.vehicles) if feature.vehicles else None
    }

@app.route('/owners', methods=['GET', 'POST'])
def owners():
    if request.method == 'GET':
        owners = Owner.query.all()
        return jsonify([owner_to_dict(owner) for owner in owners])
    elif request.method == 'POST':
        data = request.get_json()
        if not data or not all(field in data for field in ['owner_name', 'contact_info', 'age', 'address']):
            return jsonify({'error': 'Missing required fields'}), 400

        new_owner = Owner(
            owner_name=data['owner_name'],
            contact_info=data['contact_info'],
            age=data['age'],
            address=data['address']
        )
        db.session.add(new_owner)
        db.session.commit()
        return jsonify(owner_to_dict(new_owner)), 201

@app.route('/owners/<int:owner_id>', methods=['GET', 'PATCH', 'DELETE'])
def owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({'error': 'Owner not found'}), 404

    if request.method == 'GET':
        return jsonify(owner_to_dict(owner))

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing data'}), 400

        for field, value in data.items():
            if field in ['owner_name', 'contact_info', 'age', 'address']:
                setattr(owner, field, value)

        db.session.commit()
        return jsonify(owner_to_dict(owner))

    elif request.method == 'DELETE':
        db.session.delete(owner)
        db.session.commit()
        return jsonify({'message': 'Owner deleted successfully'})

@app.route('/vehicles', methods=['GET', 'POST'])
def vehicles():
    if request.method == 'GET':
        vehicles = Vehicle.query.all()
        return jsonify([vehicle_to_dict(vehicle) for vehicle in vehicles])
    elif request.method == 'POST':
        data = request.get_json()
        if not data or not all(field in data for field in ['make', 'model', 'year', 'price']):
            return jsonify({'error': 'Missing required fields'}), 400

        new_vehicle = Vehicle(
            vehicle_id=data['vehicle_id'],
            make=data['make'],
            model=data['model'],
            car_image=data.get('car_image'),  # Optional field
            year=data['year'],
            price=data['price'],
            description=data.get('description'),  # Optional field
            owner_id=data.get('owner_id')  # Optional field
        )
        db.session.add(new_vehicle)
        db.session.commit()
        return jsonify(vehicle_to_dict(new_vehicle)), 201

@app.route('/vehicles/<int:vehicle_id>', methods=['GET', 'PATCH', 'DELETE'])
def vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return jsonify({'error': 'Vehicle not found'}), 404

    if request.method == 'GET':
        return jsonify(vehicle_to_dict(vehicle))

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing data'}), 400

        for field, value in data.items():
            if field in ['vehicle_id','make', 'model', 'car_image', 'year', 'price', 'description', 'owner_id']:
                setattr(vehicle, field, value)

        db.session.commit()
        return jsonify(vehicle_to_dict(vehicle))

    elif request.method == 'DELETE':
        db.session.delete(vehicle)
        db.session.commit()
        return jsonify({'message': 'Vehicle deleted successfully'})

@app.route('/rentals', methods=['GET', 'POST'])
def rentals():
    if request.method == 'GET':
        rentals = Rental.query.all()
        return jsonify([rental_to_dict(rental) for rental in rentals])
    elif request.method == 'POST':
        data = request.get_json()
        if not data or not all(field in data for field in ['customer_name','vehicle_id', 'duration_days', 'price']):
            return jsonify({'error': 'Missing required fields'}), 400

        vehicle = Vehicle.query.get(data['vehicle_id'])
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404

        new_rental = Rental(
            customer_name=data['customer_name'],
            vehicle_id=data['vehicle_id'],
            duration_days=data['duration_days'],
            price=data['price']
        )
        db.session.add(new_rental)
        db.session.commit()
        return jsonify(rental_to_dict(new_rental)), 201

@app.route('/rentals/<int:rental_id>', methods=['GET', 'PATCH', 'DELETE'])
def rental(rental_id):
    rental = Rental.query.get(rental_id)
    if not rental:
        return jsonify({'error': 'Rental not found'}), 404

    if request.method == 'GET':
        return jsonify(rental_to_dict(rental))

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing data'}), 400

        for field, value in data.items():
            if field in ['customer_name', 'vehicle_id', 'duration_days', 'price']:
                setattr(rental, field, value)

        db.session.commit()
        return jsonify(rental_to_dict(rental))

    elif request.method == 'DELETE':
        db.session.delete(rental)
        db.session.commit()
        return jsonify({'message': 'Rental deleted successfully'})

@app.route('/features', methods=['GET', 'POST'])
def features():
    if request.method == 'GET':
        features = Feature.query.all()
        return jsonify([feature_to_dict(feature) for feature in features])
    elif request.method == 'POST':
        data = request.get_json()
        if not data or not all(field in data for field in ['feature_id','speed_km', 'car_cc', 'fuel_type', 'vehicle_id']):
            return jsonify({'error': 'Missing required fields'}), 400

        vehicles = Vehicle.query.get(data['vehicle_id'])
        if not vehicles:
            return jsonify({'error': 'Vehicle not found'}), 404
    
        new_feature = Feature(
            feature_id=data['feature_id'],
            speed_km=data['speed_km'],
            car_cc=data['car_cc'],
            fuel_type=data['fuel_type'],
            vehicle_id=data['vehicle_id']
        )
        db.session.add(new_feature)
        db.session.commit()
        return jsonify(feature_to_dict(new_feature)), 201

@app.route('/features/<int:feature_id>', methods=['GET', 'PATCH', 'DELETE'])
def feature(feature_id):
    feature = Feature.query.get(feature_id)
    if not feature:
        return jsonify({'error': 'Feature not found'}), 404

    if request.method == 'GET':
        return jsonify(feature_to_dict(feature))

    if request.method == 'PATCH':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Missing data'}), 400

        for field, value in data.items():
            if field in ['feature_id','speed_km', 'car_cc', 'fuel_type', 'vehicle_id']:
                setattr(feature, field, value)

        db.session.commit()
        return jsonify(feature_to_dict(feature))

    elif request.method == 'DELETE':
        db.session.delete(feature)
        db.session.commit()
        return jsonify({'message': 'Feature deleted successfully'})



@app.route('/api/likes/<int:vehicle_id>', methods=['GET'])
def get_reactions(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle:
        return jsonify({
            'likes': vehicle.likes if vehicle.likes is not None else 0,
            'dislikes': vehicle.dislikes if vehicle.dislikes is not None else 0
        })
    return jsonify({'error': 'Vehicle not found'}), 404

@app.route('/api/likes', methods=['POST'])
def update_reactions():
    data = request.get_json()
    vehicle_id = data.get('vehicleId')
    reaction = data.get('reaction')

    vehicle = Vehicle.query.get(vehicle_id)
    if vehicle:
        if vehicle.likes is None:
            vehicle.likes = 0
        if vehicle.dislikes is None:
            vehicle.dislikes = 0
        
        if reaction == 'like':
            vehicle.likes += 1
            if data.get('dislike'):
                vehicle.dislikes -= 1
        elif reaction == 'dislike':
            vehicle.dislikes += 1
            if data.get('like'):
                vehicle.likes -= 1
        db.session.commit()
        return jsonify({'message': 'Reaction updated successfully'})
    return jsonify({'error': 'Vehicle not found'}), 404



@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',  
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
        return ('', 204, headers)

    
    data = request.json  
    username = data.get('username')
    password = data.get('password')

    if username == 'testuser' and password == 'testpassword':
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    owner_name = data.get('owner_name')
    contact_info = data.get('contact_info')
    age = data.get('age')
    address = data.get('address')

    
    if not all([owner_name, contact_info, age, address]):
        return jsonify({'error': 'Missing required fields'}), 400

   
    new_owner = Owner(
        owner_name=owner_name,
        contact_info=contact_info,
        age=age,
        address=address
    )
    db.session.add(new_owner)
    db.session.commit()

    return jsonify({'message': 'Registration successful', 'owner_id': new_owner.owner_id}), 201

if __name__ == '__main__':
    app.run(port=5555, debug=True)
