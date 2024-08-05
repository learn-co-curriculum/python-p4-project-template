from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from datetime import datetime
from models import db, Employee, Meeting, Manager, EmployeeMeeting

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

@app.route('/employees', methods=['GET', 'POST'])
def employees():
    if request.method == 'GET':
        employees = Employee.query.all()
        return make_response(
            jsonify([employee.to_dict() for employee in employees]),
            200,
        )
    elif request.method == 'POST':
        data = request.get_json()
        hire_date = datetime.strptime(data.get('hire_date'), '%Y-%m-%d')
        new_employee = Employee(
            name=data.get('name'),
            hire_date=hire_date,
            manager_id=data.get('manager_id'),
        )
        db.session.add(new_employee)
        db.session.commit()
        return make_response(new_employee.to_dict(), 201)
        
    return make_response(
        jsonify({'text': 'Method not Allowed'}),
        405,
    )

@app.route('/employees/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def employee_by_id(id):
    employee = Employee.query.filter(Employee.id == id).first()
    
    if employee is None:
        response_body = {
            "message": "This employee does not exist in our database. Please try again."
        }
        response = make_response(response_body, 404)
        return response

    elif request.method == 'GET':
        response = make_response(employee.to_dict(), 200)
        return response
    
    elif request.method == 'PATCH':
        data = request.get_json()
        if 'name' in data:
            employee.name = data['name']
        db.session.add(employee)
        db.session.commit()
        response = make_response(employee.to_dict(), 200)
        return response
    
    elif request.method == 'DELETE':
        db.session.delete(employee)
        db.session.commit()

        response_body = {
            "delete_successful": True,
            "message": "Employee deleted."
        }

        response = make_response(response_body, 200)
        return response
    
@app.route('/managers', methods=['GET', 'POST'])
def managers():
    if request.method == 'GET':
        managers = Manager.query.all()

        return make_response(
            jsonify([manager.to_dict() for manager in managers]), 200
        )
    
    elif request.method == 'POST':
        data = request.get_json()
        new_manager = Manager(
            name=data.get('name'),
            department=data.get('department'),
        )

        db.session.add(new_manager)
        db.session.commit()

        return make_response(new_manager.to_dict(), 201)

@app.route('/managers/<int:id>', methods=['GET', 'PATCH', 'DELETE']) 
def manager_by_id(id):
    manager = Manager.query.filter(Manager.id == id).first()

    if manager is None:
        response_body = {
            "message": "Manager not found in our database, please try again"
        }

        return make_response(response_body, 404)
    
    else:
        if request.method == 'GET':
            return make_response(manager.to_dict(), 200)
        
        elif request.method == 'PATCH':
            data = request.get_json()
            for attr, value in data.items():
                setattr(manager, attr, value)
            db.session.add(manager)
            db.session.commit()

            return make_response(manager.to_dict(), 200)
        
        elif request.method == 'DELETE':
            db.session.delete(manager)
            db.session.commit()

            response_body = {
            "delete_successful": True,
            "message": "Manager deleted."
        }
            return make_response(response_body, 200)
            


@app.route('/meetings', methods=['GET', 'POST'])
def meetings():
    if request.method == 'GET':
        meetings = Meeting.query.all()
        return make_response(
            jsonify([meeting.to_dict() for meeting in meetings]), 200
        )
    
    elif request.method == 'POST':
        data = request.get_json()
        try:
            scheduled_time = datetime.fromisoformat(data.get('scheduled_time'))
        except ValueError:
            return make_response({"error": "Invalid datetime format"}, 400)

        new_meeting = Meeting(
            topic=data.get('topic'),
            scheduled_time=scheduled_time,
            location=data.get('location')
        )
        db.session.add(new_meeting)
        db.session.commit()
        return make_response(new_meeting.to_dict(), 201)

@app.route('/meetings/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def meetings_by_id(id):
    meeting = Meeting.query.filter(Meeting.id == id).first()
    
    if meeting is None:
        response_body = {"message": "Meeting not found in our database, please try again"}
        return make_response(response_body, 404)
    
    if request.method == 'GET':
        return make_response(meeting.to_dict(), 200)
        
    elif request.method == 'PATCH':
        data = request.get_json()
        for attr, value in data.items():
            if attr == 'scheduled_time':
                try:
                    # Ensure the datetime format is handled correctly
                    value = datetime.fromisoformat(value)
                except ValueError:
                    response_body = {"message": "Invalid date format. Please use ISO 8601 format."}
                    return make_response(response_body, 400)
            setattr(meeting, attr, value)
        db.session.add(meeting)
        db.session.commit()
        return make_response(meeting.to_dict(), 200)
        
    elif request.method == 'DELETE':
        db.session.delete(meeting)
        db.session.commit()
        response_body = {
            "delete_successful": True,
            "message": "Meeting deleted."
        }
        return make_response(response_body, 200)
    
@app.route('/employee_meetings/<int:employee_id>/<int:meeting_id>', methods=['GET', 'PATCH', 'DELETE'])
def employee_meetings_by_id(employee_id, meeting_id):
    employee_meeting = EmployeeMeeting.query.filter_by(employee_id=employee_id, meeting_id=meeting_id).first()
    
    if employee_meeting is None:
        response_body = {"message": "EmployeeMeeting not found in our database, please try again"}
        return make_response(response_body, 404)
    
    if request.method == 'GET':
        return make_response(employee_meeting.to_dict(), 200)
        
    elif request.method == 'PATCH':
        data = request.get_json()
        if 'rsvp' in data:
            employee_meeting.rsvp = data['rsvp']
        db.session.add(employee_meeting)
        db.session.commit()
        return make_response(employee_meeting.to_dict(), 200)
        
    elif request.method == 'DELETE':
        db.session.delete(employee_meeting)
        db.session.commit()
        response_body = {
            "delete_successful": True,
            "message": "EmployeeMeeting deleted."
        }
        return make_response(response_body, 200)



    
if __name__ == '__main__':
    app.run(port=5555, debug=True)
