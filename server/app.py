from config import app, api, db, bcrypt, jwt
from flask_restful import Resource
from flask import make_response
from datetime import datetime
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from models import User, TimeLog, Role, Department
from sqlalchemy.orm import joinedload


# Global Error Handling
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify(error=str(e)), 500

# Fetch roles from the database
@app.route('/roles')
def get_roles():
    roles = Role.query.all()
    role_data = [{'id': role.id, 'name': role.name} for role in roles]
    return jsonify({'roles': role_data})

# Fetch departments from the database
@app.route('/departments')
def get_departments():
    departments = Department.query.all()
    department_data = [{'id': department.id, 'name': department.name} for department in departments]
    return jsonify({'departments': department_data})

# No Marshmallow Schemas

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# Authentication Endpoints
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify("Wrong username or password"), 401

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)
    return response


@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate that the password field is present and non-empty
        if 'password' not in data or not data['password']:
            return jsonify(message="Password is required"), 400

        # Check if the username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify(message="User already exists"), 409
        
        # Generate password hash
        data['password_hash'] = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Check if roles and departments exist, if not, add them
        role_employee = Role.query.filter_by(name='employee').first()
        if not role_employee:
            role_employee = Role(name='employee', description='Employee role')
            db.session.add(role_employee)
        
        role_manager = Role.query.filter_by(name='manager').first()
        if not role_manager:
            role_manager = Role(name='manager', description='Manager role')
            db.session.add(role_manager)

        department_employee = Department.query.filter_by(name='team member').first()
        if not department_employee:
            department_employee = Department(name='team member')
            db.session.add(department_employee)

        department_manager = Department.query.filter_by(name='admin').first()
        if not department_manager:
            department_manager = Department(name='admin')
            db.session.add(department_manager)
        
        # Create user object and add to database
        del data['password']
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        
        return jsonify(message="User created successfully"), 201
    except Exception as err:
        return jsonify(error=str(err)), 500

# Resource Classes with Validation and Admin Controls
class UserResource(Resource):
    @jwt_required()
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        # No Marshmallow dumping
        return jsonify(id=user.id, username=user.username, name=user.name, email=user.email, role_id=user.role_id, department_id=user.department_id)

    @jwt_required()
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        try:
            # No Marshmallow loading
            data = request.get_json()
            data.pop('password_hash', None)  # Ignore password_hash if it's part of the request
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
            return jsonify(id=user.id, username=user.username, name=user.name, email=user.email, role_id=user.role_id, department_id=user.department_id)
        except Exception as err:
            return {'errors': 'err.messages'}, 400

    @jwt_required()
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted successfully'}, 204

class UserListResource(Resource):
    @jwt_required()
    def get(self):
    
        users = User.query.all()
        # No Marshmallow dumping
        user_list = [{'id': user.id, 'username': user.username, 'name': user.name, 'email': user.email, 'role_id': user.role_id, 'department_id': user.department_id} for user in users]
        return jsonify(users=user_list)

class TimeLogResource(Resource):
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        print(user)

        if not user:
            return jsonify({'message': "User not found"}), 404

        try:
            user_id = user.id
            clock_in = datetime.strptime(data['clock_in'], '%H:%M').time()
            clock_out = datetime.strptime(data['clock_out'], '%H:%M').time()

            data['user_id'] = user_id


            time_log = TimeLog(
                user_id=user.id,
                date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
                clock_in=clock_in,
                clock_out=clock_out,
                hours_worked=data.get('hours_worked', 0),  # Default to 0 if not provided
                total_hours=data.get('total_hours', 0),
                status=data.get('status', 'Pending')
            )
            db.session.add(time_log)
            db.session.commit()
            
            return make_response(time_log.to_dict(), 201)
        except KeyError as e:
            return jsonify({'error': f'Missing key {e}'}), 400
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        
        
        
        
# Register the resource with the API (do this in your Flask setup/configuration file)
# api.add_resource(TimeLogResource, '/timelogs', '/timelogs/<int:time_log_id>')

# Standalone function for fetching all time logs
@app.route('/timelogs', methods=['GET'])
@jwt_required()
def get_timelogs():
    current_user_username = get_jwt_identity()
    try:
        user = User.query.filter_by(username=current_user_username).first_or_404()
        time_logs = TimeLog.query.filter_by(user_id=user.id).all()
        time_log_data = [log.to_dict() for log in time_logs]  # Assuming TimeLog has a to_dict() method
        return jsonify({'timeLogs': time_log_data}), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
    
@app.route('/timelogs/<int:time_log_id>', methods=['PATCH'])
@jwt_required()
def update_time_log(time_log_id):
    data = request.get_json()
    print("Received data:", data)  # Log the received data
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    time_log = TimeLog.query.get_or_404(time_log_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    try:
        # Ensure keys match expected format from frontend
        time_log.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        time_log.clock_in = datetime.strptime(data['clock_in'], '%H:%M').time()  # Ensure this matches the frontend key
        time_log.clock_out = datetime.strptime(data['clock_out'], '%H:%M').time()
        print("Parsed Times:", time_log.clock_in, time_log.clock_out)
        # import ipdb
        # ipdb.set_trace()
        time_log.hours_worked = data.get('hours_worked', time_log.hours_worked)  # Matching frontend key
        time_log.total_hours = data.get('total_hours', time_log.total_hours)
        time_log.status = data.get('status', time_log.status)

        db.session.commit()

        updated_time_log = db.session.get(TimeLog, time_log_id)
        print(f"Updated Time Log: {updated_time_log.date}, {updated_time_log.clock_in}, {updated_time_log.clock_out}, {updated_time_log.hours_worked}, {updated_time_log.total_hours}, {updated_time_log.status}")

        return jsonify(updated_time_log.to_dict()), 200
    except KeyError as e:
        return jsonify({'error': f'Missing key {e}'}), 400
    except ValueError as e:
        return jsonify({'error': 'Incorrect time format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/timelogs/<int:time_log_id>', methods=['DELETE'])
@jwt_required()
def delete_time_log(time_log_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    time_log = TimeLog.query.get_or_404(time_log_id)

    # Only allow deletion if the current user is the owner of the time log
    if time_log.user_id == user.id:
        db.session.delete(time_log)
        db.session.commit()
        return jsonify({'message': 'Time log deleted successfully'}), 204

    # If the user is not the owner, deny access
    return jsonify({'message': 'Unauthorized'}), 403




    @app.route('/timelogs/<int:time_log_id>', methods=['PATCH'])
    @jwt_required()
    def update_time_log(time_log_id):
        current_user = get_jwt_identity()
        user = User.query.options(joinedload(User.role)).filter_by(username=current_user).first()
        time_log = TimeLog.query.get_or_404(time_log_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        if 'status' in data and user.role.name != 'Admin':
            return jsonify({'message': 'Unauthorized to update status'}), 403

        # Allowed updates for all users
        allowed_updates = {'date', 'clock_in', 'clock_out'}
        # Additional field 'status' can be updated by admin only
        if user.role.name == 'Admin':
            allowed_updates.add('status')

        for key in data:
            if key in allowed_updates:
                setattr(time_log, key, data[key])
        
        db.session.commit()
        return jsonify({'message': 'Time log updated successfully', 'time_log': time_log.to_dict()}), 200

    @jwt_required()
    def delete(self, time_log_id):
        current_user = get_jwt_identity()
        user = User.query.filter_by(username=current_user).first()
        time_log = TimeLog.query.get_or_404(time_log_id)
        
        if user.role.name == 'Admin' or time_log.user_id == user.id:
            db.session.delete(time_log)
            db.session.commit()
            return {'message': 'TimeLog deleted'}, 204
        return {'message': 'Unauthorized'}, 403

# Setup API resources
api.add_resource(UserListResource, '/users')
api.add_resource(UserResource, '/users/<int:user_id>')
api.add_resource(TimeLogResource, '/timelogs', '/timelogs/<int:time_log_id>')

def populate_roles_departments():
    # Check if roles and departments exist, if not, add them
    role_employee = Role.query.filter_by(name='employee').first()
    if not role_employee:
        role_employee = Role(name='employee', description='Employee role')
        db.session.add(role_employee)
    
    role_manager = Role.query.filter_by(name='manager').first()
    if not role_manager:
        role_manager = Role(name='manager', description='Manager role')
        db.session.add(role_manager)

    department_employee = Department.query.filter_by(name='team member').first()
    if not department_employee:
        department_employee = Department(name='team member')
        db.session.add(department_employee)

    department_manager = Department.query.filter_by(name='admin').first()
    if not department_manager:
        department_manager = Department(name='admin')
        db.session.add(department_manager)
    
    db.session.commit()

if __name__ == '__main__':
    # Uncomment the following line to populate roles and departments
    # populate_roles_departments()
    app.run(port=5555, debug=True)
