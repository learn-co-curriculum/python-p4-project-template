#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS
from sqlalchemy.orm import backref


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key_here'  


db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
CORS(app)  

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)
    patients = db.relationship('Patient', backref='doctor', lazy=True)


class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor


@app.route('/')
def index():
    return '<h1>Hills Hospital API</h1>'


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

if __name__ == '__main__':
    app.run(debug=True)
