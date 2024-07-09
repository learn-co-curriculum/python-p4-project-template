#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from sqlalchemy.orm import backref

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Replace with your secret key

# Initialize database
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
CORS(app)  # Enable CORS for development, adjust for production

# Models
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)
    patients = db.relationship('Patient', backref='doctor', lazy=True)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    symptoms = db.relationship('Symptom', secondary='patient_symptom', backref='patients')

class Symptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    patients = db.relationship('Patient', secondary='patient_symptom', backref='symptoms')

class PatientSymptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    symptom_id = db.Column(db.Integer, db.ForeignKey('symptom.id'), nullable=False)
    severity = db.Column(db.Integer, nullable=True)  # Example user-submittable attribute

# Schemas for serialization with Marshmallow
class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor

class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
    doctor = ma.Nested(DoctorSchema)

class SymptomSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Symptom

# Routes
@app.route('/')
def index():
    return '<h1>Hills Hospital API</h1>'

# CRUD routes example (replace with actual implementation)
@app.route('/doctors', methods=['GET', 'POST'])
def doctors():
    if request.method == 'GET':
        doctors = Doctor.query.all()
        doctor_schema = DoctorSchema(many=True)
        return jsonify(doctor_schema.dump(doctors))
    elif request.method == 'POST':
        name = request.json['name']
        specialty = request.json['specialty']
        new_doctor = Doctor(name=name, specialty=specialty)
        db.session.add(new_doctor)
        db.session.commit()
        return jsonify({'message': 'New doctor added successfully.'}), 201

@app.route('/patients', methods=['GET', 'POST'])
def patients():
    if request.method == 'GET':
        patients = Patient.query.all()
        patient_schema = PatientSchema(many=True)
        return jsonify(patient_schema.dump(patients))
    elif request.method == 'POST':
        name = request.json['name']
        age = request.json['age']
        doctor_id = request.json['doctor_id']
        new_patient = Patient(name=name, age=age, doctor_id=doctor_id)
        db.session.add(new_patient)
        db.session.commit()
        return jsonify({'message': 'New patient added successfully.'}), 201

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
