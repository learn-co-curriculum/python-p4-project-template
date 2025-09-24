# Schemas using Flask-Marshmallow
from flask_marshmallow import Marshmallow

from config import app
from models import User, Reading, Medication, Meal, Doctor

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


