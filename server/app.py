#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

# Local imports
from config import app, db, api
from models import User, Reading, Medication, Meal, Doctor, reading_meals, Reminder, EducationalTip, DoctorMessage, BMISnapshot
from schemas import UserSchema, ReadingSchema, MedicationSchema, MealSchema, DoctorSchema
from kenyan_foods import KENYAN_FOODS, get_food_recommendations, get_diabetes_friendly_foods, get_foods_to_limit
from glucose_predictor import analyze_user_patterns, generate_predictive_alerts, get_meal_specific_predictions, get_food_impact_prediction
from gamification import BADGES, DAILY_CHALLENGES, get_user_progress, check_badges, get_daily_challenges_status
from educational_insights import get_personalized_insights, get_food_recommendations_by_status, get_glucose_trend

# ---------------- Basic route ----------------
@app.route('/')
def index():
    return '<h1>Diabetes Management API</h1>'

# ---------------- Authentication ----------------
class Signup(Resource):
    def post(self):
        data = request.get_json()
        
        # Basic validation
        if not data.get('name') or not data.get('email') or not data.get('password'):
            return {'error': 'Name, email, and password are required'}, 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return {'error': 'User with this email already exists'}, 400
        
        try:
            # Create new user
            user = User(
                name=data['name'],
                email=data['email']
            )
            user.password_hash = data['password']  # This will trigger the setter
            # Optional diabetes_type at signup
            if 'diabetes_type' in data:
                user.diabetes_type = data['diabetes_type']
            
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            access_token = create_access_token(identity=user.id)
            
            return {
                'user': user.to_dict(),
                'access_token': access_token,
                'education': education_for(user.diabetes_type),
                'advice': advice_for(user)
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return {'error': 'Email and password are required'}, 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.authenticate(data['password']):
            access_token = create_access_token(identity=user.id)
            return {
                'user': user.to_dict(),
                'access_token': access_token,
                'education': education_for(user.diabetes_type),
                'advice': advice_for(user)
            }, 200
        else:
            return {'error': 'Invalid email or password'}, 401

class CheckSession(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user:
            resp = user.to_dict()
            resp['education'] = education_for(user.diabetes_type)
            resp['advice'] = advice_for(user)
            return resp, 200
        else:
            return {'error': 'User not found'}, 404

class PasswordForgot(Resource):
    def post(self):
        data = request.get_json() or {}
        email = (data.get('email') or '').strip().lower()
        if not email:
            return {'error': 'email is required'}, 400
        # In production, generate a reset token and email it. Here, return a generic response.
        user = User.query.filter_by(email=email).first()
        if not user:
            # Do not reveal user existence; return same message
            return {'message': 'If the email exists, a reset link has been sent.'}, 200
        # Stub success response
        return {'message': 'If the email exists, a reset link has been sent.'}, 200

class PasswordUpdate(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        data = request.get_json() or {}
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        if not current_password or not new_password:
            return {'error': 'current_password and new_password are required'}, 400
        if not user.authenticate(current_password):
            return {'error': 'Current password is incorrect'}, 400
        try:
            user.password_hash = new_password
            db.session.commit()
            return {'message': 'Password updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# ---------------- Helpers (dates/times/validation) ----------------

def parse_date(date_str):
    # Expecting YYYY-MM-DD
    return datetime.strptime(date_str, '%Y-%m-%d').date()

def parse_time(time_str):
    # Expecting HH:MM
    return datetime.strptime(time_str, '%H:%M').time()

def validate_glucose_value(value):
    try:
        v = float(value)
    except Exception:
        return False
    return 40 <= v <= 500

# ---------------- Diabetes education ----------------
EDU = {
    'type1': [
        'Type 1 diabetes: autoimmune; requires insulin therapy.',
        'Monitor carbs and time insulin with meals.',
        'Carry fast-acting glucose to treat lows.'
    ],
    'type2': [
        'Type 2 diabetes: insulin resistance; lifestyle and meds help.',
        'Focus on weight management, low-GI carbs, regular activity.',
        'Monitor blood sugar trends and medication adherence.'
    ],
    'gestational': [
        'Gestational diabetes: occurs in pregnancy; close monitoring.',
        'Follow meal plan, stay active, and track sugars as advised.'
    ],
    'prediabetes': [
        'Prediabetes: elevated sugars; lifestyle changes are effective.',
        'Aim for 150+ minutes weekly activity and balanced meals.'
    ]
}

def education_for(diabetes_type):
    return EDU.get((diabetes_type or '').lower(), [])

# ---------------- Personalized advice (nutrition/exercise/medication) ----------------
def bmi_category_for(height_cm, weight_kg):
    try:
        if not height_cm or not weight_kg:
            return None
        h = float(height_cm) / 100.0
        bmi = float(weight_kg) / (h ** 2)
        if bmi < 18.5:
            return 'Underweight'
        elif bmi < 25:
            return 'Normal'
        elif bmi < 30:
            return 'Overweight'
        else:
            return 'Obese'
    except Exception:
        return None

def advice_for(user):
    """Return a dict with nutrition/exercise/medication tips customized by diabetes_type and BMI."""
    dtype = (user.diabetes_type or '').lower()
    bmi_cat = bmi_category_for(user.height_cm, user.weight_kg)
    base_nutrition = [
        'Prioritize whole foods: vegetables, lean proteins, healthy fats.',
        'Choose low-glycemic carbs and adequate fiber.',
        'Balance plates: half non-starchy veg, quarter protein, quarter carbs.'
    ]
    base_exercise = [
        'Aim for 150+ minutes/week of moderate activity (e.g., brisk walking).',
        'Add 2–3 days/week of resistance training if able.',
        'Light movement after meals (10–15 min) can help post-meal glucose.'
    ]
    base_med = [
        'Take medications exactly as prescribed.',
        'Discuss changes or side effects with your clinician.',
        'Never adjust insulin/meds without medical guidance.'
    ]

    # Adjust by diabetes type
    if dtype == 'type1':
        base_nutrition += ['Count carbohydrates and match insulin appropriately.']
        base_exercise += ['Monitor glucose before/after exercise; carry fast-acting carbs.']
        base_med += ['Review basal/bolus strategy and correction factors with your care team.']
    elif dtype == 'type2':
        base_nutrition += ['Focus on weight management and portion control.']
        base_exercise += ['Build consistency; short daily walks are very effective.']
        base_med += ['Metformin adherence and timing can matter; ask about alternatives if GI side effects.']
    elif dtype == 'gestational':
        base_nutrition += ['Follow pregnancy meal plan and carb targets from your clinician.']
        base_exercise += ['Prefer low-impact activity as approved by your provider.']
        base_med += ['Frequent monitoring and close coordination with your obstetric team.']
    elif dtype == 'prediabetes':
        base_nutrition += ['Reduce sugary drinks and refined carbs; emphasize fiber.']
        base_exercise += ['Accumulate movement throughout the day; aim for daily consistency.']
        base_med += ['Lifestyle changes are first-line; discuss medication only if advised.']

    # Adjust by BMI category if available
    if bmi_cat == 'Underweight':
        base_nutrition += ['Ensure adequate calories and protein; seek a dietitian if losing weight unintentionally.']
    elif bmi_cat == 'Overweight':
        base_nutrition += ['Create a modest calorie deficit; consider smaller plates and mindful eating.']
        base_exercise += ['Start gently and build up duration; track steps to motivate progress.']
    elif bmi_cat == 'Obese':
        base_nutrition += ['Work with your clinician on a structured weight-loss plan; consider dietitian support.']
        base_exercise += ['Low-impact options (walking, cycling, swimming) reduce joint stress; progress gradually.']

    return {
        'nutrition': base_nutrition,
        'exercise': base_exercise,
        'medication': base_med,
        'bmi_category': bmi_cat,
    }

# ---------------- Glucose evaluation ----------------
TIPS_NORMAL = [
    'Maintain balanced meals with non-starchy veggies, lean protein, and healthy fats.',
    'Stay hydrated and keep up light daily activity.',
    'Aim for consistent meal times and portion control.'
]
TIPS_HIGH = [
    'Take a 15–30 minute walk and hydrate with water.',
    'Reduce refined carbohydrates; choose low-GI, high-fiber foods.',
    'Include lean proteins and healthy fats to slow glucose spikes.',
    'Discuss supplements with your doctor (e.g., cinnamon, berberine).'
]

def evaluate_glucose(value, context):
    # Simple rules: pre_meal 80-130 normal, post_meal < 180 normal
    status = 'unknown'
    color = 'gray'
    suggestions = []
    if context == 'pre_meal':
        if 80 <= value <= 130:
            status, color, suggestions = 'normal', 'green', TIPS_NORMAL
        elif value > 130:
            status, color, suggestions = 'high', 'red', TIPS_HIGH
        else:
            status, color, suggestions = 'low', 'yellow', ['Consider a small balanced snack and consult your clinician if frequent.']
    else:  # post_meal or unknown
        if value < 180:
            status, color, suggestions = 'normal', 'green', TIPS_NORMAL
        elif value >= 180:
            status, color, suggestions = 'high', 'red', TIPS_HIGH
    return {'status': status, 'color': color, 'suggestions': suggestions}

# ---------------- Schemas ----------------
user_schema = UserSchema()
reading_schema = ReadingSchema()
readings_schema = ReadingSchema(many=True)
medication_schema = MedicationSchema()
medications_schema = MedicationSchema(many=True)
meal_schema = MealSchema()
meals_schema = MealSchema(many=True)
doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True)

# ---------------- Readings CRUD ----------------
class Readings(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        items = Reading.query.filter_by(user_id=user_id).order_by(Reading.date, Reading.time).all()
        return readings_schema.dump(items), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        required = ['value', 'date', 'time']
        if not all(k in data for k in required):
            return {'error': 'value, date (YYYY-MM-DD), and time (HH:MM) are required'}, 400
        if not validate_glucose_value(data['value']):
            return {'error': 'value must be a number between 40 and 500'}, 400
        context = data.get('context')
        if context and context not in ['pre_meal', 'post_meal']:
            return {'error': "context must be 'pre_meal' or 'post_meal'"}, 400
        try:
            reading = Reading(
                value=float(data['value']),
                date=parse_date(data['date']),
                time=parse_time(data['time']),
                notes=data.get('notes'),
                context=context,
                user_id=user_id,
            )
            db.session.add(reading)
            db.session.commit()
            payload = reading_schema.dump(reading)
            if context:
                payload['evaluation'] = evaluate_glucose(reading.value, context)
            return payload, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class ReadingById(Resource):
    @jwt_required()
    def get(self, id):
        user_id = get_jwt_identity()
        reading = Reading.query.filter_by(id=id, user_id=user_id).first()
        if not reading:
            return {'error': 'Reading not found'}, 404
        payload = reading_schema.dump(reading)
        if reading.context:
            payload['evaluation'] = evaluate_glucose(reading.value, reading.context)
        return payload, 200

    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        reading = Reading.query.filter_by(id=id, user_id=user_id).first()
        if not reading:
            return {'error': 'Reading not found'}, 404
        data = request.get_json()
        if 'value' in data:
            if not validate_glucose_value(data['value']):
                return {'error': 'value must be a number between 40 and 500'}, 400
            reading.value = float(data['value'])
        if 'date' in data:
            reading.date = parse_date(data['date'])
        if 'time' in data:
            reading.time = parse_time(data['time'])
        if 'notes' in data:
            reading.notes = data['notes']
        if 'context' in data:
            if data['context'] not in ['pre_meal', 'post_meal', None]:
                return {'error': "context must be 'pre_meal' or 'post_meal'"}, 400
            reading.context = data['context']
        try:
            db.session.commit()
            payload = reading_schema.dump(reading)
            if reading.context:
                payload['evaluation'] = evaluate_glucose(reading.value, reading.context)
            return payload, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()
        reading = Reading.query.filter_by(id=id, user_id=user_id).first()
        if not reading:
            return {'error': 'Reading not found'}, 404
        try:
            db.session.delete(reading)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# ---------------- Profile + BMI ----------------
class UserProfile(Resource):
    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        data = request.get_json()
        if 'name' in data and data['name']:
            user.name = data['name']
        if 'diabetes_type' in data:
            user.diabetes_type = data['diabetes_type'] or None
        if 'doctor_id' in data:
            # allow unassigning by sending null
            user.doctor_id = data['doctor_id']
        if 'height_cm' in data:
            try:
                user.height_cm = float(data['height_cm']) if data['height_cm'] is not None else None
            except Exception:
                return {'error': 'height_cm must be a number'}, 400
        if 'weight_kg' in data:
            try:
                user.weight_kg = float(data['weight_kg']) if data['weight_kg'] is not None else None
            except Exception:
                return {'error': 'weight_kg must be a number'}, 400
        try:
            db.session.commit()
            resp = user_schema.dump(user)
            resp['education'] = education_for(user.diabetes_type)
            resp['advice'] = advice_for(user)
            return resp, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class UserBMI(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        if not user.height_cm or not user.weight_kg:
            return {'error': 'height_cm and weight_kg must be set on profile'}, 400
        height_m = user.height_cm / 100.0
        bmi = user.weight_kg / (height_m ** 2)
        if bmi < 18.5:
            category = 'Underweight'
        elif bmi < 25:
            category = 'Normal'
        elif bmi < 30:
            category = 'Overweight'
        else:
            category = 'Obese'
        return {'bmi': round(bmi, 1), 'category': category}, 200

# Add resources to API
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(PasswordForgot, '/password/forgot')
api.add_resource(PasswordUpdate, '/password/update')
api.add_resource(Readings, '/readings')
api.add_resource(ReadingById, '/readings/<int:id>')
api.add_resource(UserProfile, '/me')
api.add_resource(UserBMI, '/me/bmi')

# ---------------- Medications (create/read + update status) ----------------
class Medications(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        meds = Medication.query.filter_by(user_id=user_id).order_by(Medication.time).all()
        return medications_schema.dump(meds), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        required = ['name', 'dose', 'time']
        if not all(k in data and data[k] for k in required):
            return {'error': 'name, dose, and time (HH:MM) are required'}, 400
        try:
            med = Medication(
                name=data['name'].strip(),
                dose=data['dose'].strip(),
                time=parse_time(data['time']),
                status=(data.get('status') or 'pending'),
                user_id=user_id,
            )
            db.session.add(med)
            db.session.commit()
            return medication_schema.dump(med), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class MedicationById(Resource):
    @jwt_required()
    def patch(self, id):
        user_id = get_jwt_identity()
        med = Medication.query.filter_by(id=id, user_id=user_id).first()
        if not med:
            return {'error': 'Medication not found'}, 404
        data = request.get_json()
        if 'status' in data:
            if data['status'] not in ['pending', 'taken', 'missed']:
                return {'error': "status must be 'pending', 'taken', or 'missed'"}, 400
            med.status = data['status']
        if 'time' in data:
            med.time = parse_time(data['time'])
        if 'name' in data and data['name']:
            med.name = data['name'].strip()
        if 'dose' in data and data['dose']:
            med.dose = data['dose'].strip()
        try:
            db.session.commit()
            return medication_schema.dump(med), 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# Register medication resources
api.add_resource(Medications, '/medications')
api.add_resource(MedicationById, '/medications/<int:id>')

# ---------------- Meals (create/read) ----------------
class Meals(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        # Return only meals that are linked to this user's readings OR simple listing of all meals
        # For simplicity, we'll return all meals the user created in this app context.
        # If meals are global, you could return all.
        meals = Meal.query.order_by(Meal.created_at.desc()).all()
        return meals_schema.dump(meals), 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        if not data.get('name'):
            return {'error': 'name is required'}, 400
        meal = Meal(
            name=data['name'].strip(),
            meal_type=data.get('meal_type'),
            description=data.get('description'),
        )
        try:
            db.session.add(meal)
            db.session.commit()
            return meal_schema.dump(meal), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

api.add_resource(Meals, '/meals')

# ---------------- Link/Unlink Meals to Readings with carbs_amount ----------------
class ReadingMeals(Resource):
    @jwt_required()
    def post(self, reading_id):
        """Attach a meal to a reading with optional carbs_amount."""
        user_id = get_jwt_identity()
        reading = Reading.query.filter_by(id=reading_id, user_id=user_id).first()
        if not reading:
            return {'error': 'Reading not found'}, 404
        data = request.get_json()
        if not data or not data.get('meal_id'):
            return {'error': 'meal_id is required'}, 400
        meal = Meal.query.get(data['meal_id'])
        if not meal:
            return {'error': 'Meal not found'}, 404
        carbs_amount = data.get('carbs_amount')
        try:
            ins = reading_meals.insert().values(
                reading_id=reading.id,
                meal_id=meal.id,
                carbs_amount=carbs_amount,
            )
            db.session.execute(ins)
            db.session.commit()
            return {'message': 'linked', 'reading_id': reading.id, 'meal_id': meal.id, 'carbs_amount': carbs_amount}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

    @jwt_required()
    def delete(self, reading_id):
        """Detach a meal from a reading."""
        user_id = get_jwt_identity()
        reading = Reading.query.filter_by(id=reading_id, user_id=user_id).first()
        if not reading:
            return {'error': 'Reading not found'}, 404
        meal_id = request.args.get('meal_id', type=int)
        if not meal_id:
            return {'error': 'meal_id query param is required'}, 400
        try:
            delete_stmt = reading_meals.delete().where(
                (reading_meals.c.reading_id == reading.id) & (reading_meals.c.meal_id == meal_id)
            )
            db.session.execute(delete_stmt)
            db.session.commit()
            return {}, 204
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

api.add_resource(ReadingMeals, '/readings/<int:reading_id>/meals')

# ---------------- Doctors (create/list and list patients) ----------------
class Doctors(Resource):
    def get(self):
        items = Doctor.query.order_by(Doctor.id.desc()).all()
        return doctors_schema.dump(items), 200

    def post(self):
        data = request.get_json()
        if not data or not data.get('name') or not data.get('email'):
            return {'error': 'name and email are required'}, 400
        if Doctor.query.filter_by(email=data['email']).first():
            return {'error': 'Doctor with this email already exists'}, 400
        try:
            doc = Doctor(
                name=data['name'].strip(),
                email=data['email'].strip(),
                phone=(data.get('phone') or '').strip() or None,
            )
            db.session.add(doc)
            db.session.commit()
            return doctor_schema.dump(doc), 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DoctorsSeed(Resource):
    def post(self):
        """Seed the database with a few sample doctors if table is empty."""
        try:
            count = Doctor.query.count()
            if count > 0:
                return {'message': 'Doctors already exist', 'count': count}, 200
            samples = [
                { 'name': 'Dr. Amina Wanjiru', 'email': 'amina.wanjiru@kenhealth.org', 'phone': '+254700111222' },
                { 'name': 'Dr. Brian Otieno', 'email': 'b.otieno@kenhealth.org', 'phone': '+254711222333' },
                { 'name': 'Dr. Carol Njeri', 'email': 'carol.njeri@kenhealth.org', 'phone': '+254722333444' },
                { 'name': 'Dr. Daniel Mwangi', 'email': 'daniel.mwangi@kenhealth.org', 'phone': '+254733444555' },
                { 'name': 'Dr. Esther Mutua', 'email': 'e.mutua@kenhealth.org', 'phone': '+254744555666' },
            ]
            for s in samples:
                db.session.add(Doctor(name=s['name'], email=s['email'], phone=s.get('phone')))
            db.session.commit()
            return {'message': 'Seeded', 'count': len(samples)}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class DoctorPatients(Resource):
    def get(self, doctor_id):
        doc = Doctor.query.get(doctor_id)
        if not doc:
            return {'error': 'Doctor not found'}, 404
        patients = [u.to_dict() for u in doc.patients]
        return {'doctor': doctor_schema.dump(doc), 'patients': patients}, 200

api.add_resource(Doctors, '/doctors')
api.add_resource(DoctorsSeed, '/doctors/seed')
api.add_resource(DoctorPatients, '/doctors/<int:doctor_id>/patients')

# ---------------- Kenyan Food Database ----------------
class KenyanFoods(Resource):
    def get(self):
        """Get all Kenyan foods with nutritional data"""
        return {'foods': KENYAN_FOODS}, 200

class FoodRecommendations(Resource):
    @jwt_required()
    def get(self):
        """Get personalized food recommendations for the user"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        language = request.args.get('lang', 'en')
        diabetes_type = user.diabetes_type or 'type2'  # Default to type2
        
        recommendations = get_food_recommendations(diabetes_type, language)
        friendly_foods = get_diabetes_friendly_foods()
        foods_to_limit = get_foods_to_limit()
        
        return {
            'recommendations': recommendations,
            'diabetes_friendly': list(friendly_foods.keys()),
            'foods_to_limit': list(foods_to_limit.keys()),
            'diabetes_type': diabetes_type
        }, 200

api.add_resource(KenyanFoods, '/kenyan-foods')
api.add_resource(FoodRecommendations, '/food-recommendations')

# ---------------- Predictive Glucose Alerts ----------------
class GlucoseAlerts(Resource):
    @jwt_required()
    def get(self):
        """Get predictive alerts based on user's glucose patterns"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        
        language = request.args.get('lang', 'en')
        
        # Get recent readings (last 30 days)
        from datetime import date, timedelta
        cutoff_date = date.today() - timedelta(days=30)
        recent_readings = Reading.query.filter(
            Reading.user_id == user_id,
            Reading.date >= cutoff_date
        ).order_by(Reading.date.desc(), Reading.time.desc()).all()
        
        if len(recent_readings) < 3:
            return {
                'alerts': [],
                'message': 'Need more readings to generate predictions' if language == 'en' else 'Inahitaji vipimo zaidi ili kutoa utabiri'
            }, 200
        
        # Analyze patterns and generate alerts
        patterns = analyze_user_patterns(recent_readings)
        alerts = generate_predictive_alerts(user, patterns, language)
        
        return {
            'alerts': alerts,
            'patterns_summary': {
                'total_readings': len(recent_readings),
                'high_readings': patterns.get('high_readings_count', 0),
                'low_readings': patterns.get('low_readings_count', 0),
                'recent_trend': patterns.get('recent_trend', 'stable'),
                'avg_pre_meal': patterns.get('avg_pre_meal'),
                'avg_post_meal': patterns.get('avg_post_meal')
            }
        }, 200

class MealPrediction(Resource):
    @jwt_required()
    def post(self):
        """Get meal-specific predictions"""
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'context' not in data:
            return {'error': 'context (pre_meal/post_meal) is required'}, 400
        
        language = data.get('language', 'en')
        meal_context = data['context']
        
        # Get recent readings for pattern analysis
        from datetime import date, timedelta
        cutoff_date = date.today() - timedelta(days=14)
        recent_readings = Reading.query.filter(
            Reading.user_id == user_id,
            Reading.date >= cutoff_date
        ).order_by(Reading.date.desc()).all()
        
        predictions = get_meal_specific_predictions(recent_readings, meal_context, language)
        
        return {'predictions': predictions}, 200

class FoodImpactPredictor(Resource):
    @jwt_required()
    def post(self):
        """Predict how a specific food will impact user's glucose"""
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'food_name' not in data:
            return {'error': 'food_name is required'}, 400
        
        language = data.get('language', 'en')
        food_name = data['food_name']
        
        # Get user's patterns
        from datetime import date, timedelta
        cutoff_date = date.today() - timedelta(days=30)
        recent_readings = Reading.query.filter(
            Reading.user_id == user_id,
            Reading.date >= cutoff_date
        ).order_by(Reading.date.desc()).all()
        
        patterns = analyze_user_patterns(recent_readings) if recent_readings else None
        prediction = get_food_impact_prediction(food_name, patterns, language)
        
        if not prediction:
            return {'error': 'Food not found in database'}, 404
        
        return {'prediction': prediction}, 200

api.add_resource(GlucoseAlerts, '/glucose-alerts')
api.add_resource(MealPrediction, '/meal-prediction')
api.add_resource(FoodImpactPredictor, '/food-impact')

# ---------------- Gamification System ----------------
class UserProgress(Resource):
    @jwt_required()
    def get(self):
        """Get user's gamification progress"""
        user_id = get_jwt_identity()
        language = request.args.get('lang', 'en')
        
        # Get user data
        readings = Reading.query.filter_by(user_id=user_id).all()
        medications = Medication.query.filter_by(user_id=user_id).all()
        
        # Calculate progress
        progress = get_user_progress(readings, medications)
        earned_badges = check_badges(readings)
        daily_status = get_daily_challenges_status(readings)
        
        # Format badges with localized text
        user_badges = []
        for badge_id in earned_badges:
            if badge_id in BADGES:
                badge = BADGES[badge_id].copy()
                badge['id'] = badge_id
                badge['name'] = badge['name'][language]
                badge['description'] = badge['description'][language]
                user_badges.append(badge)
        
        # Format daily challenges
        daily_challenges = []
        for challenge_id, challenge_data in DAILY_CHALLENGES.items():
            challenge = challenge_data.copy()
            challenge['id'] = challenge_id
            challenge['name'] = challenge['name'][language]
            challenge['description'] = challenge['description'][language]
            challenge['status'] = daily_status.get(challenge_id, {'completed': False, 'progress': 0})
            daily_challenges.append(challenge)
        
        # Format level info
        level_info = progress['level']
        level_info['title'] = level_info['title'][language]
        
        return {
            'progress': {
                'current_streak': progress['current_streak'],
                'total_readings': progress['total_readings'],
                'weekly_readings': progress['weekly_readings'],
                'level': level_info,
                'total_points': progress['total_readings'] * 10 + progress['current_streak'] * 5
            },
            'badges': user_badges,
            'daily_challenges': daily_challenges,
            'available_badges': [
                {
                    'id': badge_id,
                    'name': badge_data['name'][language],
                    'description': badge_data['description'][language],
                    'icon': badge_data['icon'],
                    'points': badge_data['points'],
                    'earned': badge_id in earned_badges
                }
                for badge_id, badge_data in BADGES.items()
            ]
        }, 200

api.add_resource(UserProgress, '/user-progress')

# ---------------- Enhanced Features ----------------

# Dashboard endpoint
class Dashboard(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return {'error': 'User not found'}, 404
        
        # Get glucose trend
        glucose_trend = get_glucose_trend(user_id, days=30)
        
        # Get latest reading
        latest_reading = Reading.query.filter_by(user_id=user_id).order_by(
            Reading.date.desc(), Reading.time.desc()
        ).first()
        
        # Get recent readings for chart
        recent_readings = Reading.query.filter_by(user_id=user_id).order_by(
            Reading.date.desc(), Reading.time.desc()
        ).limit(30).all()
        
        # Get personalized insights
        insights = get_personalized_insights(user_id)
        
        # Get flagged readings count
        flagged_count = Reading.query.filter_by(user_id=user_id, is_flagged=True).count()
        
        return {
            'user_profile': user.to_dict(),
            'glucose_trend': glucose_trend,
            'latest_reading': latest_reading.to_dict() if latest_reading else None,
            'recent_readings': [r.to_dict() for r in recent_readings],
            'insights': insights,
            'flagged_readings_count': flagged_count,
            'summary_cards': {
                'total_readings': len(recent_readings),
                'average_glucose': glucose_trend['average'],
                'bmi': user.bmi,
                'bmi_category': user.bmi_category
            }
        }, 200

# Educational Insights endpoint
class EducationalInsights(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        insights = get_personalized_insights(user_id)

        # Determine language if provided (default en)
        language = request.args.get('lang', 'en')

        # Latest reading and BMI category
        latest_reading = Reading.query.filter_by(user_id=user_id).order_by(
            Reading.date.desc(), Reading.time.desc()
        ).first()
        latest_status = latest_reading.glucose_status if latest_reading else None
        bmi_cat = user.bmi_category if user else None

        # Base recommendations by glucose status
        status_recs = get_food_recommendations_by_status(latest_status) if latest_status else None

        # Kenyan-local general recommendations by diabetes type
        dtype = (user.diabetes_type or 'type2') if user else 'type2'
        base_local = get_food_recommendations(dtype, language)

        # Merge logic: start from status-based recs, then enrich with BMI-aware tips and local lists
        recommended = []
        avoid = []
        tips = []

        # From status recommendations (already Kenya-focused in our helper)
        if status_recs:
            recommended += status_recs.get('recommended', [])
            avoid += status_recs.get('avoid', [])
            if status_recs.get('tips'):
                tips.append(status_recs['tips'])

        # From base_local
        if base_local:
            recommended += base_local.get('recommended', [])
            avoid += base_local.get('avoid', [])
            if base_local.get('tips'):
                tips.append(base_local['tips'])

        # BMI-aware guidance
        if bmi_cat == 'Overweight' or bmi_cat == 'Obese':
            tips.append('Prefer high-fiber, low-GI staples (e.g., sukuma wiki, ndengu, terere, beans). Keep chapati/mandazi minimal; choose ugali wa mtama/brown rice in small portions.')
            avoid += ['Fried snacks (samosa, bhajia) often', 'Sugary drinks', 'Large portions of white ugali/rice']
        elif bmi_cat == 'Underweight':
            tips.append('Include nutrient-dense foods to reach a healthy weight: add avocado, eggs, beans, groundnuts, and whole grains. Keep sugars controlled.')
            recommended += ['Avocado', 'Eggs', 'Beans/ndengu', 'Groundnuts', 'Millet ugali']
        elif bmi_cat == 'Normal weight':
            tips.append('Maintain balance: non-starchy vegetables, lean proteins (fish, chicken), healthy fats, and whole grains.')

        # De-duplicate while preserving order
        def uniq(seq):
            seen = set()
            out = []
            for x in seq:
                if x not in seen:
                    seen.add(x)
                    out.append(x)
            return out

        food_recommendations = {
            'recommended': uniq(recommended),
            'avoid': uniq(avoid),
            'tips': ' '.join(uniq(tips)) if tips else None,
            'latest_status': latest_status,
            'bmi_category': bmi_cat,
        }

        # Build detailed reasons/tags for UI "why" toggle
        def reason_for(item: str, list_type: str):
            lower = (item or '').lower()
            # Heuristic keyword-based reasons
            if any(k in lower for k in ['sukuma', 'kale', 'spinach', 'terere', 'managu', 'mboga']):
                return {'reason_en': 'High fiber, low GI veggie; supports glucose control', 'reason_sw': 'Nyuzinyuzi nyingi, GI ya chini; husaidia kudhibiti sukari', 'tags': ['high-fiber','low-GI','veggies']}
            if any(k in lower for k in ['bean', 'ndengu', 'lentil', 'pojo']):
                return {'reason_en': 'Protein and fiber; slower glucose rise', 'reason_sw': 'Protini na nyuzinyuzi; hupunguza kasi ya kupanda kwa sukari', 'tags': ['protein','fiber','low-GI']}
            if 'avocado' in lower:
                return {'reason_en': 'Healthy fats; increases satiety', 'reason_sw': 'Mafuta mazuri; hukutosheleza', 'tags': ['healthy-fats']}
            if any(k in lower for k in ['egg','mayai']):
                return {'reason_en': 'Lean protein; minimal impact on glucose', 'reason_sw': 'Protini konda; athari ndogo kwa sukari', 'tags': ['protein']}
            if any(k in lower for k in ['millet', 'mtama']):
                return {'reason_en': 'Whole grain option; lower GI than refined ugali', 'reason_sw': 'Nafaka kamili; GI ya chini kuliko ugali mweupe', 'tags': ['whole-grain','lower-GI']}
            if 'brown rice' in lower or 'brown' in lower:
                return {'reason_en': 'Higher fiber than white rice; steadier glucose', 'reason_sw': 'Nyuzinyuzi zaidi kuliko wali mweupe; sukari tulivu', 'tags': ['higher-fiber','lower-GI']}
            if any(k in lower for k in ['sugary', 'soda', 'juice', 'sweet']):
                return {'reason_en': 'Rapid glucose spike; avoid especially with high readings', 'reason_sw': 'Huinua sukari haraka; epuka hasa ikiwa juu', 'tags': ['high-sugar']}
            if any(k in lower for k in ['white ugali', 'white rice', 'chapati', 'mandazi']):
                return {'reason_en': 'Refined carb; higher GI and portion-sensitive', 'reason_sw': 'Wanga uliosafishwa; GI ya juu na nyeti kwa kiasi', 'tags': ['refined-carb','high-GI']}
            if any(k in lower for k in ['fried', 'bhajia', 'samosa', 'chips']):
                return {'reason_en': 'Fried/refined; may worsen insulin resistance', 'reason_sw': 'Vyakula vya kukaanga/ulosafishwa; vinaweza kuongeza usugu wa insulini', 'tags': ['fried','refined']}
            # Fallback generic reasons
            return {'reason_en': 'Generally aligned with your current plan', 'reason_sw': 'Kwa ujumla inaendana na mpango wako wa sasa', 'tags': []}

        food_recommendations['recommended_detailed'] = [
            {'item': it, **reason_for(it, 'recommended')} for it in food_recommendations['recommended']
        ]
        food_recommendations['avoid_detailed'] = [
            {'item': it, **reason_for(it, 'avoid')} for it in food_recommendations['avoid']
        ]

        return {
            'insights': insights,
            'food_recommendations': food_recommendations
        }, 200

# Reminders endpoint
class Reminders(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        reminders = Reminder.query.filter_by(user_id=user_id, is_active=True).all()
        return {'reminders': [r.to_dict() for r in reminders]}, 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            reminder = Reminder(
                user_id=user_id,
                reminder_type=data['reminder_type'],
                title=data['title'],
                message=data.get('message'),
                scheduled_time=datetime.strptime(data['scheduled_time'], '%H:%M').time(),
                frequency=data.get('frequency', 'daily')
            )
            
            db.session.add(reminder)
            db.session.commit()
            
            return {'reminder': reminder.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

class ReminderById(Resource):
    @jwt_required()
    def put(self, id):
        user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=id, user_id=user_id).first()
        
        if not reminder:
            return {'error': 'Reminder not found'}, 404
        
        data = request.get_json()
        
        try:
            if 'is_active' in data:
                reminder.is_active = data['is_active']
            if 'scheduled_time' in data:
                reminder.scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
            if 'frequency' in data:
                reminder.frequency = data['frequency']
            
            db.session.commit()
            return {'reminder': reminder.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400
    
    @jwt_required()
    def delete(self, id):
        user_id = get_jwt_identity()
        reminder = Reminder.query.filter_by(id=id, user_id=user_id).first()
        
        if not reminder:
            return {'error': 'Reminder not found'}, 404
        
        try:
            db.session.delete(reminder)
            db.session.commit()
            return {'message': 'Reminder deleted successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# Doctor Messages endpoint
class DoctorMessages(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.doctor_id:
            return {'error': 'No assigned doctor found'}, 404
        
        messages = DoctorMessage.query.filter_by(
            user_id=user_id, 
            doctor_id=user.doctor_id
        ).order_by(DoctorMessage.created_at.desc()).limit(50).all()
        
        return {'messages': [m.to_dict() for m in messages]}, 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        if not user or not user.doctor_id:
            return {'error': 'No assigned doctor found'}, 404
        
        try:
            message = DoctorMessage(
                user_id=user_id,
                doctor_id=user.doctor_id,
                sender_type='user',
                message=data['message'],
                is_emergency=data.get('is_emergency', False)
            )
            
            db.session.add(message)
            db.session.commit()
            
            return {'message': message.to_dict()}, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# Enhanced User Profile endpoint
class EnhancedUserProfile(Resource):
    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        if not user:
            return {'error': 'User not found'}, 404
        
        try:
            # Update profile fields
            if 'age' in data:
                user.age = data['age']
            if 'gender' in data:
                user.gender = data['gender']
            if 'height_cm' in data:
                user.height_cm = data['height_cm']
            if 'weight_kg' in data:
                user.weight_kg = data['weight_kg']
            if 'emergency_contact_name' in data:
                user.emergency_contact_name = data['emergency_contact_name']
            if 'emergency_contact_phone' in data:
                user.emergency_contact_phone = data['emergency_contact_phone']
            if 'last_hospital_visit' in data:
                user.last_hospital_visit = datetime.strptime(data['last_hospital_visit'], '%Y-%m-%d').date()
            
            db.session.commit()

            # After updating, record BMI snapshot if height/weight available
            try:
                snapshot = BMISnapshot(
                    user_id=user.id,
                    bmi=user.bmi,
                    weight_kg=user.weight_kg,
                    height_cm=user.height_cm
                )
                db.session.add(snapshot)
                db.session.commit()
            except Exception:
                db.session.rollback()
            return {'user': user.to_dict()}, 200
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# Enhanced Readings with validation
class EnhancedReadings(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        try:
            reading = Reading(
                user_id=user_id,
                value=data['value'],
                date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
                time=datetime.strptime(data['time'], '%H:%M').time(),
                context=data.get('context', 'random'),
                notes=data.get('notes')
            )
            
            # Auto-flag abnormal readings
            glucose_status = reading.glucose_status
            if glucose_status in ['high', 'low']:
                reading.is_flagged = True
            
            db.session.add(reading)
            db.session.commit()
            
            # Get personalized insights based on this reading
            insights = get_personalized_insights(user_id)
            
            return {
                'reading': reading.to_dict(),
                'insights': insights[:2]  # Return top 2 insights
            }, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400

# BMI History endpoint
class BMIHistory(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        limit = int(request.args.get('limit', 20))
        snapshots = BMISnapshot.query.filter_by(user_id=user_id).order_by(BMISnapshot.created_at.desc()).limit(limit).all()
        return {'history': [s.to_dict() for s in snapshots]}, 200

# Register new endpoints
api.add_resource(Dashboard, '/dashboard')
api.add_resource(EducationalInsights, '/educational-insights')
api.add_resource(Reminders, '/reminders')
api.add_resource(ReminderById, '/reminders/<int:id>')
api.add_resource(DoctorMessages, '/doctor-messages')
api.add_resource(EnhancedUserProfile, '/profile/enhanced')
api.add_resource(EnhancedReadings, '/readings/enhanced')
api.add_resource(BMIHistory, '/bmi-history')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=True)
