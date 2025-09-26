#!/usr/bin/env python3

"""
Educational Insights System for Diabetes Management
Provides personalized tips based on glucose trends, BMI, and local Kenyan context
"""

from datetime import datetime, timedelta
from sqlalchemy import func
from models import User, Reading, EducationalTip
from config import db

# Kenya-specific educational content
KENYAN_EDUCATIONAL_TIPS = {
    'high_glucose': [
        {
            'title': 'Managing High Blood Sugar with Local Foods',
            'content': 'When your blood sugar is high, focus on low-carb Kenyan foods like sukuma wiki (kale), spinach, and cabbage. Avoid ugali, rice, and chapati temporarily. Drink plenty of water and consider a short walk.',
            'category': 'food',
            'local_relevance': True,
            'priority': 'high'
        },
        {
            'title': 'Kenyan Herbs for Blood Sugar',
            'content': 'Traditional Kenyan herbs like bitter leaf (mululuza) and neem leaves can help manage blood sugar. Consult your doctor before using herbal remedies alongside your medication.',
            'category': 'general',
            'local_relevance': True,
            'priority': 'medium'
        },
        {
            'title': 'Exercise with High Blood Sugar',
            'content': 'Light exercise like walking around your compound or doing household chores can help lower blood sugar. Avoid intense exercise when glucose is very high (>300 mg/dL).',
            'category': 'exercise',
            'local_relevance': False,
            'priority': 'high'
        }
    ],
    'low_glucose': [
        {
            'title': 'Quick Treatment for Low Blood Sugar',
            'content': 'For low blood sugar, quickly consume 15g of fast-acting carbs: 3-4 glucose tablets, 1 tablespoon honey, or 1/2 cup fruit juice. Wait 15 minutes and recheck your levels.',
            'category': 'emergency',
            'local_relevance': False,
            'priority': 'high'
        },
        {
            'title': 'Kenyan Foods for Low Blood Sugar',
            'content': 'Keep these Kenyan foods handy for low blood sugar: ripe bananas, passion fruit juice, or a small piece of sugarcane. Follow up with protein like groundnuts or boiled eggs.',
            'category': 'food',
            'local_relevance': True,
            'priority': 'high'
        }
    ],
    'normal': [
        {
            'title': 'Maintaining Good Control with Kenyan Diet',
            'content': 'Great job! Maintain your levels with balanced Kenyan meals: combine ugali/rice with plenty of vegetables (sukuma wiki, cabbage), lean protein (fish, chicken, beans), and limit portion sizes.',
            'category': 'food',
            'local_relevance': True,
            'priority': 'medium'
        },
        {
            'title': 'Hydration in Kenyan Climate',
            'content': 'In Kenya\'s climate, stay well hydrated with water. Avoid sugary drinks like soda. Coconut water is a good natural option for hydration.',
            'category': 'general',
            'local_relevance': True,
            'priority': 'medium'
        }
    ],
    'bmi_tips': {
        'underweight': [
            {
                'title': 'Healthy Weight Gain for Diabetics',
                'content': 'Focus on nutrient-dense Kenyan foods: avocados, groundnuts, sweet potatoes, and lean proteins. Eat frequent small meals and consult your doctor about adjusting diabetes medication.',
                'category': 'food',
                'local_relevance': True,
                'priority': 'medium'
            }
        ],
        'overweight': [
            {
                'title': 'Weight Management with Kenyan Foods',
                'content': 'Focus on vegetables like sukuma wiki, spinach, and cabbage. Choose smaller portions of ugali/rice. Include proteins like fish, beans, and chicken. Avoid fried foods and sugary drinks.',
                'category': 'food',
                'local_relevance': True,
                'priority': 'high'
            }
        ],
        'obese': [
            {
                'title': 'Diabetes and Weight Loss in Kenya',
                'content': 'Work with your doctor on a weight loss plan. Focus on vegetables, lean proteins, and controlled portions. Consider joining community walking groups or local fitness activities.',
                'category': 'exercise',
                'local_relevance': True,
                'priority': 'high'
            }
        ]
    }
}

def get_glucose_trend(user_id, days=7):
    """Analyze glucose trends over the past week"""
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    readings = Reading.query.filter(
        Reading.user_id == user_id,
        Reading.date >= start_date,
        Reading.date <= end_date
    ).order_by(Reading.date.desc(), Reading.time.desc()).all()
    
    if not readings:
        return {'trend': 'no_data', 'average': None, 'readings_count': 0}
    
    values = [r.value for r in readings]
    average = sum(values) / len(values)
    
    # Determine trend
    if len(readings) >= 3:
        recent_avg = sum(values[:3]) / 3
        older_avg = sum(values[-3:]) / 3
        
        if recent_avg > older_avg + 20:
            trend = 'increasing'
        elif recent_avg < older_avg - 20:
            trend = 'decreasing'
        else:
            trend = 'stable'
    else:
        trend = 'insufficient_data'
    
    return {
        'trend': trend,
        'average': round(average, 1),
        'readings_count': len(readings),
        'latest_reading': readings[0].to_dict() if readings else None
    }

def get_personalized_insights(user_id):
    """Get personalized educational insights for a user"""
    user = User.query.get(user_id)
    if not user:
        return []
    
    insights = []
    glucose_trend = get_glucose_trend(user_id)
    
    # Get latest reading status
    latest_reading = Reading.query.filter_by(user_id=user_id).order_by(
        Reading.date.desc(), Reading.time.desc()
    ).first()
    
    if latest_reading:
        glucose_status = latest_reading.glucose_status
        
        # Add glucose-specific tips
        if glucose_status in KENYAN_EDUCATIONAL_TIPS:
            insights.extend(KENYAN_EDUCATIONAL_TIPS[glucose_status])
    
    # Add BMI-specific tips
    if user.bmi_category and user.bmi_category.lower().replace(' ', '_') in KENYAN_EDUCATIONAL_TIPS['bmi_tips']:
        bmi_category = user.bmi_category.lower().replace(' ', '_')
        insights.extend(KENYAN_EDUCATIONAL_TIPS['bmi_tips'][bmi_category])
    
    # Add trend-based insights
    if glucose_trend['trend'] == 'increasing':
        insights.append({
            'title': 'Rising Blood Sugar Trend Detected',
            'content': f'Your average blood sugar has been increasing over the past week (current average: {glucose_trend["average"]} mg/dL). Review your diet, medication timing, and stress levels. Contact your doctor if this continues.',
            'category': 'general',
            'local_relevance': False,
            'priority': 'high'
        })
    elif glucose_trend['trend'] == 'decreasing':
        insights.append({
            'title': 'Improving Blood Sugar Control',
            'content': f'Great progress! Your blood sugar trend is improving (current average: {glucose_trend["average"]} mg/dL). Keep up your current routine and continue monitoring regularly.',
            'category': 'general',
            'local_relevance': False,
            'priority': 'medium'
        })
    
    # Prioritize insights
    insights.sort(key=lambda x: {'high': 3, 'medium': 2, 'low': 1}[x['priority']], reverse=True)
    
    return insights[:5]  # Return top 5 insights

def get_food_recommendations_by_status(glucose_status, local_only=True):
    """Get food recommendations based on current glucose status"""
    recommendations = {
        'high': {
            'avoid': ['Ugali', 'White rice', 'Chapati', 'Mandazi', 'Soda', 'Fruit juice'],
            'recommended': ['Sukuma wiki', 'Spinach', 'Cabbage', 'Tomatoes', 'Cucumber', 'Fish', 'Chicken breast'],
            'tips': 'Focus on non-starchy vegetables and lean proteins. Drink plenty of water.'
        },
        'low': {
            'immediate': ['Ripe banana', 'Passion fruit juice', 'Honey (1 tbsp)', 'Glucose tablets'],
            'follow_up': ['Groundnuts', 'Boiled eggs', 'Milk', 'Whole grain bread'],
            'tips': 'Treat immediately with fast-acting carbs, then follow with protein.'
        },
        'normal': {
            'maintain': ['Balanced portions of ugali + vegetables', 'Fish with sukuma wiki', 'Beans and rice', 'Chicken with salad'],
            'snacks': ['Groundnuts', 'Avocado', 'Boiled eggs', 'Greek yogurt'],
            'tips': 'Maintain balance with controlled portions and regular meal timing.'
        }
    }
    
    return recommendations.get(glucose_status, recommendations['normal'])

def seed_educational_tips():
    """Seed the database with educational tips"""
    # Clear existing tips
    EducationalTip.query.delete()
    
    # Add tips from our knowledge base
    all_tips = []
    for condition, tips in KENYAN_EDUCATIONAL_TIPS.items():
        if condition != 'bmi_tips':
            for tip in tips:
                all_tips.append(EducationalTip(
                    category=tip['category'],
                    condition=condition,
                    title=tip['title'],
                    content=tip['content'],
                    local_relevance=tip['local_relevance'],
                    priority=tip['priority']
                ))
    
    # Add BMI tips
    for bmi_category, tips in KENYAN_EDUCATIONAL_TIPS['bmi_tips'].items():
        for tip in tips:
            all_tips.append(EducationalTip(
                category=tip['category'],
                condition=f'bmi_{bmi_category}',
                title=tip['title'],
                content=tip['content'],
                local_relevance=tip['local_relevance'],
                priority=tip['priority']
            ))
    
    # Add to database
    for tip in all_tips:
        db.session.add(tip)
    
    try:
        db.session.commit()
        print(f"Successfully seeded {len(all_tips)} educational tips")
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding educational tips: {e}")

if __name__ == "__main__":
    # For testing
    from config import app
    with app.app_context():
        seed_educational_tips()
