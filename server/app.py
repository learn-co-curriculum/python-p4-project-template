# app.py

from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Welcome to the Hills Hospital!'

if __name__ == '__main__':
    app.run(debug=True)

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    symptoms = db.relationship('Symptom', secondary='patient_symptom', backref='patients')

class PatientSymptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    symptom_id = db.Column(db.Integer, db.ForeignKey('symptom.id'), nullable=False)
    severity = db.Column(db.Integer, nullable=True)  # Example user-submittable attribute

class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
    doctor = ma.Nested(DoctorSchema)

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
        return jsonify({'message': 'New patient added successfully.'}), 201