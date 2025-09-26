# Schemas using Flask-Marshmallow
from flask_marshmallow import Marshmallow

from config import app
from models import User, Reading, Medication, Meal, Doctor, Reminder, EducationalTip, DoctorMessage, BMISnapshot

ma = Marshmallow(app)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = False
        include_fk = True
        exclude = ("_password_hash",)

class ReadingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reading
        load_instance = False
        include_fk = True

class MedicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Medication
        load_instance = False
        include_fk = True

class MealSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Meal
        load_instance = False
        include_fk = True

class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor
        load_instance = False
        include_fk = True

class ReminderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reminder
        load_instance = False
        include_fk = True

class EducationalTipSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = EducationalTip
        load_instance = False
        include_fk = True

class DoctorMessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = DoctorMessage
        load_instance = False
        include_fk = True

class BMISnapshotSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BMISnapshot
        load_instance = False
        include_fk = True
