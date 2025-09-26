
"""
Glucose Prediction and Alert System
Analyzes user patterns to provide predictive alerts
"""

from datetime import datetime, timedelta
from collections import defaultdict
import statistics
from kenyan_foods import KENYAN_FOODS

def analyze_user_patterns(readings):
    """Analyze user's glucose patterns from reading history"""
    if len(readings) < 3:
        return None
    
    patterns = {
        'avg_pre_meal': [],
        'avg_post_meal': [],
        'high_readings_count': 0,
        'low_readings_count': 0,
        'time_patterns': defaultdict(list),
        'recent_trend': 'stable'
    }
    
    
    for reading in readings:
        value = reading.value
        context = reading.context
        hour = reading.time.hour if reading.time else 12
        
        if context == 'pre_meal':
            patterns['avg_pre_meal'].append(value)
        elif context == 'post_meal':
            patterns['avg_post_meal'].append(value)
        
        patterns['time_patterns'][hour].append(value)
        
        
        if context == 'pre_meal' and value > 130:
            patterns['high_readings_count'] += 1
        elif context == 'post_meal' and value > 180:
            patterns['high_readings_count'] += 1
        elif value < 80:
            patterns['low_readings_count'] += 1
    

    if patterns['avg_pre_meal']:
        patterns['avg_pre_meal'] = statistics.mean(patterns['avg_pre_meal'])
    if patterns['avg_post_meal']:
        patterns['avg_post_meal'] = statistics.mean(patterns['avg_post_meal'])
    
    
    recent_values = [r.value for r in readings[-5:]]
    if len(recent_values) >= 3:
        if recent_values[-1] > recent_values[0] + 20:
            patterns['recent_trend'] = 'rising'
        elif recent_values[-1] < recent_values[0] - 20:
            patterns['recent_trend'] = 'falling'
    
    return patterns

def generate_predictive_alerts(user, patterns, language='en'):
    """Generate personalized alerts based on patterns"""
    if not patterns:
        return []
    
    alerts = []
    
    
    if patterns['high_readings_count'] > len(patterns.get('avg_pre_meal', [])) * 0.4:
        alerts.append({
            'type': 'pattern_warning',
            'severity': 'high',
            'title': {
                'en': 'Frequent High Glucose Detected',
                'sw': 'Sukari ya Damu ya Juu Imeonekana Mara Nyingi'
            },
            'message': {
                'en': f'You\'ve had {patterns["high_readings_count"]} high readings recently. Consider reviewing your meal portions and timing.',
                'sw': f'Umekuwa na vipimo {patterns["high_readings_count"]} vya juu hivi karibuni. Fikiria kuangalia vipimo vya chakula na muda.'
            },
            'recommendations': {
                'en': [
                    'Reduce portion sizes, especially ugali and chapati',
                    'Add more sukuma wiki and vegetables to meals',
                    'Take a 15-minute walk after eating',
                    'Check blood sugar 2 hours after meals'
                ],
                'sw': [
                    'Punguza vipimo vya chakula, hasa ugali na chapati',
                    'Ongeza sukuma wiki na mboga zaidi kwenye chakula',
                    'Tembea dakika 15 baada ya kula',
                    'Angalia sukari ya damu masaa 2 baada ya chakula'
                ]
            }
        })
    
    
    if patterns['recent_trend'] == 'rising':
        alerts.append({
            'type': 'trend_warning',
            'severity': 'medium',
            'title': {
                'en': 'Rising Glucose Trend',
                'sw': 'Mwelekeo wa Sukari ya Damu Kuongezeka'
            },
            'message': {
                'en': 'Your recent readings show an upward trend. Time to take action!',
                'sw': 'Vipimo vyako vya hivi karibuni vinaonyesha mwelekeo wa kuongezeka. Ni wakati wa kuchukua hatua!'
            },
            'recommendations': {
                'en': [
                    'Review what you\'ve eaten in the last few days',
                    'Increase physical activity',
                    'Consider smaller, more frequent meals',
                    'Stay hydrated with water'
                ],
                'sw': [
                    'Angalia ulichokula katika siku chache zilizopita',
                    'Ongeza mazoezi ya mwili',
                    'Fikiria chakula kidogo, mara nyingi',
                    'Kunywa maji mengi'
                ]
            }
        })
    
    
    morning_avg = statistics.mean(patterns['time_patterns'].get(8, [100])) if patterns['time_patterns'].get(8) else None
    if morning_avg and morning_avg > 140:
        alerts.append({
            'type': 'time_pattern',
            'severity': 'medium',
            'title': {
                'en': 'High Morning Glucose',
                'sw': 'Sukari ya Damu ya Juu Asubuhi'
            },
            'message': {
                'en': f'Your morning readings average {morning_avg:.1f} mg/dL, which is above target.',
                'sw': f'Vipimo vyako vya asubuhi ni wastani wa {morning_avg:.1f} mg/dL, ambayo ni juu ya lengo.'
            },
            'recommendations': {
                'en': [
                    'Avoid late-night snacking',
                    'Consider what you ate for dinner last night',
                    'Try light exercise before breakfast',
                    'Discuss with your doctor about dawn phenomenon'
                ],
                'sw': [
                    'Epuka kula chakula kidogo usiku wa manane',
                    'Fikiria ulichokula chakula cha jioni jana',
                    'Jaribu mazoezi mepesi kabla ya kifungua kinywa',
                    'Jadili na daktari wako kuhusu hali ya alfajiri'
                ]
            }
        })
    
    
    if patterns['low_readings_count'] > 2:
        alerts.append({
            'type': 'low_glucose_warning',
            'severity': 'high',
            'title': {
                'en': 'Frequent Low Glucose Episodes',
                'sw': 'Sukari ya Damu ya Chini Mara Nyingi'
            },
            'message': {
                'en': f'You\'ve had {patterns["low_readings_count"]} low readings. This needs attention.',
                'sw': f'Umekuwa na vipimo {patterns["low_readings_count"]} vya chini. Hii inahitaji umakini.'
            },
            'recommendations': {
                'en': [
                    'Always carry glucose tablets or sweets',
                    'Don\'t skip meals',
                    'Discuss medication timing with your doctor',
                    'Check glucose before driving or exercising'
                ],
                'sw': [
                    'Beba daima vidonge vya sukari au peremende',
                    'Usiruke chakula',
                    'Jadili muda wa dawa na daktari wako',
                    'Angalia sukari kabla ya kuendesha gari au kufanya mazoezi'
                ]
            }
        })
    
    return alerts

def get_meal_specific_predictions(recent_readings, meal_context, language='en'):
    """Provide meal-specific predictions based on patterns"""
    predictions = []
    
    
    similar_readings = [r for r in recent_readings if r.context == meal_context]
    
    if len(similar_readings) >= 3:
        avg_response = statistics.mean([r.value for r in similar_readings])
        
        if meal_context == 'pre_meal' and avg_response > 130:
            predictions.append({
                'type': 'meal_prediction',
                'message': {
                    'en': f'Your pre-meal readings usually average {avg_response:.1f}. Consider a lighter meal today.',
                    'sw': f'Vipimo vyako kabla ya chakula kawaida ni wastani wa {avg_response:.1f}. Fikiria chakula kizito kidogo leo.'
                },
                'food_suggestions': {
                    'en': ['Choose sukuma wiki over ugali', 'Add protein like nyama choma', 'Drink water before eating'],
                    'sw': ['Chagua sukuma wiki badala ya ugali', 'Ongeza protini kama nyama choma', 'Kunywa maji kabla ya kula']
                }
            })
    
    return predictions

def get_food_impact_prediction(food_name, user_patterns, language='en'):
    """Predict how a specific Kenyan food might affect the user"""
    food_data = KENYAN_FOODS.get(food_name.lower().replace(' ', '_'))
    if not food_data:
        return None
    
    
    glucose_impact = food_data['glucose_impact']
    user_avg = user_patterns.get('avg_post_meal', 150) if user_patterns else 150
    
    prediction = {
        'food': food_data[f'name_{language}'] if f'name_{language}' in food_data else food_data['name_en'],
        'glucose_impact': glucose_impact,
        'estimated_spike': 0,
        'recommendations': food_data['diabetes_tips'][language]
    }
    
    
    if glucose_impact == 'very_high':
        prediction['estimated_spike'] = 80 + (user_avg - 150) * 0.3
    elif glucose_impact == 'high':
        prediction['estimated_spike'] = 50 + (user_avg - 150) * 0.2
    elif glucose_impact == 'medium':
        prediction['estimated_spike'] = 30 + (user_avg - 150) * 0.1
    elif glucose_impact == 'low':
        prediction['estimated_spike'] = 15
    else:  
        prediction['estimated_spike'] = 0
    
    return prediction
