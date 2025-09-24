#!/usr/bin/env python3
"""
Glucose Prediction and Alert System
Analyzes user patterns, food impacts, and provides predictive alerts.
"""

from datetime import datetime, timedelta
from collections import defaultdict
import statistics
from kenyan_foods import KENYAN_FOODS

# ---------------- Pattern Analysis & Alerts ----------------

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
        
        # Count highs/lows
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
    
    # Trend check
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
    
    # High glucose
    if patterns['high_readings_count'] > len(patterns.get('avg_pre_meal', [])) * 0.4:
        alerts.append({
            'type': 'pattern_warning',
            'severity': 'high',
            'title': {
                'en': 'Frequent High Glucose Detected',
                'sw': 'Sukari ya Damu ya Juu Imeonekana Mara Nyingi'
            },
            'message': {
                'en': f"You've had {patterns['high_readings_count']} high readings recently. Consider reviewing your meal portions and timing.",
                'sw': f"Umekuwa na vipimo {patterns['high_readings_count']} vya juu hivi karibuni. Fikiria kuangalia vipimo vya chakula na muda."
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
    
    # Rising trend
    if patterns['recent_trend'] == 'rising':
        alerts.append({
            'type': 'trend_warning',
            'severity': 'medium',
            'title': {'en': 'Rising Glucose Trend', 'sw': 'Mwelekeo wa Sukari ya Damu Kuongezeka'},
            'message': {
                'en': 'Your recent readings show an upward trend. Time to take action!',
                'sw': 'Vipimo vyako vinaonyesha mwelekeo wa kuongezeka. Ni wakati wa kuchukua hatua!'
            }
        })
    
    # Morning highs
    morning_avg = statistics.mean(patterns['time_patterns'].get(8, [100])) if patterns['time_patterns'].get(8) else None
    if morning_avg and morning_avg > 140:
        alerts.append({
            'type': 'time_pattern',
            'severity': 'medium',
            'title': {'en': 'High Morning Glucose', 'sw': 'Sukari ya Damu ya Juu Asubuhi'},
            'message': {
                'en': f'Morning average {morning_avg:.1f} mg/dL, above target.',
                'sw': f'Wastani wa asubuhi {morning_avg:.1f} mg/dL, juu ya lengo.'
            }
        })
    
    # Frequent lows
    if patterns['low_readings_count'] > 2:
        alerts.append({
            'type': 'low_glucose_warning',
            'severity': 'high',
            'title': {'en': 'Frequent Low Glucose Episodes', 'sw': 'Sukari ya Damu ya Chini Mara Nyingi'},
            'message': {
                'en': f"{patterns['low_readings_count']} low readings detected. Needs attention.",
                'sw': f"{patterns['low_readings_count']} vipimo vya chini. Inahitaji umakini."
            }
        })
    
    return alerts


def get_meal_specific_predictions(recent_readings, meal_context, language='en'):
    """Provide meal-specific predictions based on past meal contexts"""
    predictions = []
    similar = [r for r in recent_readings if r.context == meal_context]
    
    if len(similar) >= 3:
        avg_response = statistics.mean([r.value for r in similar])
        if meal_context == 'pre_meal' and avg_response > 130:
            predictions.append({
                'type': 'meal_prediction',
                'message': {
                    'en': f'Pre-meal avg {avg_response:.1f}. Consider a lighter meal.',
                    'sw': f'Wastani wa kabla ya chakula {avg_response:.1f}. Fikiria chakula kizito kidogo.'
                }
            })
    return predictions


def get_food_impact_prediction(food_name, user_patterns, language='en'):
    """Predict how a Kenyan food might affect the user"""
    food_data = KENYAN_FOODS.get(food_name.lower().replace(' ', '_'))
    if not food_data:
        return None
    
    glucose_impact = food_data['glucose_impact']
    user_avg = user_patterns.get('avg_post_meal', 150) if user_patterns else 150
    
    prediction = {
        'food': food_data.get(f'name_{language}', food_data['name_en']),
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
    
    return prediction


# ---------------- AI Model Integration ----------------

import numpy as np, pandas as pd, joblib, json
from typing import List, Tuple, Optional
from dataclasses import dataclass
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from kenyan_foods import get_kenyan_food_database, KenyanFood

@dataclass
class GlucoseReading:
    timestamp: datetime
    glucose_level: float
    meal_context: Optional[str] = None
    food_consumed: Optional[List[str]] = None
    portion_sizes: Optional[List[float]] = None
    exercise_minutes: Optional[int] = None
    stress_level: Optional[int] = None
    sleep_hours: Optional[float] = None

@dataclass
class UserProfile:
    user_id: str
    age: int
    weight_kg: float
    height_cm: float
    diabetes_type: Optional[str] = None
    medication: Optional[List[str]] = None
    activity_level: str = "moderate"
    target_glucose_range: Tuple[float, float] = (80, 140)

class GlucosePredictor:
    """AI-powered glucose prediction system (RandomForest placeholder)"""
    # (full class logic can be expanded here…)

glucose_predictor = GlucosePredictor()

def get_glucose_predictor() -> GlucosePredictor:
    return glucose_predictor


# ---------------- Nick's Simple REST API ----------------

from flask import request
from flask_restful import Resource

def predict_glucose_next(recent_readings, carbs, gi):
    """Naive heuristic prediction"""
    baseline = sum(recent_readings[-5:]) / min(len(recent_readings), 5) if recent_readings else 110.0
    gi_factor = (gi or 50) / 100.0
    food_impact = carbs * gi_factor * 0.8
    predicted = baseline + food_impact - 10
    return max(60.0, min(predicted, 350.0))

def risk_band(glucose):
    if glucose < 70: return "low"
    if glucose <= 140: return "target"
    if glucose <= 200: return "elevated"
    return "high"

class GlucosePredict(Resource):
    def post(self):
        payload = request.get_json(force=True, silent=True) or {}
        recent = payload.get("recent_readings") or []
        carbs = float(payload.get("carbs") or 0)
        gi = float(payload.get("gi") or 50)
        try:
            recent = [float(x) for x in recent]
        except Exception:
            return {"error": "recent_readings must be numeric"}, 400
        predicted = predict_glucose_next(recent, carbs, gi)
        return {"predicted_glucose": round(predicted, 1), "risk": risk_band(predicted)}, 200
