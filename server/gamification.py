#!/usr/bin/env python3
"""
Gamification System for Diabetes Management
"""

from datetime import datetime, date, timedelta
from flask import request
from flask_restful import Resource

# ---------------- Core Gamification System ----------------

BADGES = {
    'first_reading': {
        'name': {'en': 'First Steps', 'sw': 'Hatua za Kwanza'},
        'description': {'en': 'Logged your first reading', 'sw': 'Umerejesha kipimo chako cha kwanza'},
        'icon': '🩸',
        'points': 10
    },
    'week_streak': {
        'name': {'en': 'Week Warrior', 'sw': 'Shujaa wa Wiki'},
        'description': {'en': '7 consecutive days', 'sw': 'Siku 7 mfululizo'},
        'icon': '🔥',
        'points': 50
    },
    'glucose_champion': {
        'name': {'en': 'Glucose Champion', 'sw': 'Bingwa wa Sukari'},
        'description': {'en': 'Target levels for 5 days', 'sw': 'Viwango vya lengo kwa siku 5'},
        'icon': '🏆',
        'points': 75
    }
}

DAILY_CHALLENGES = {
    'log_reading': {
        'name': {'en': 'Log Reading', 'sw': 'Rejesha Kipimo'},
        'description': {'en': 'Record one reading today', 'sw': 'Rekodi kipimo kimoja leo'},
        'icon': '📊',
        'points': 10
    },
    'morning_check': {
        'name': {'en': 'Morning Check', 'sw': 'Ukaguzi wa Asubuhi'},
        'description': {'en': 'Log before 10 AM', 'sw': 'Rejesha kabla ya saa 10'},
        'icon': '🌅',
        'points': 15
    }
}

def get_user_progress(readings, medications):
    """Calculate user progress"""
    today = date.today()
    week_ago = today - timedelta(days=7)
    recent_readings = [r for r in readings if r.date >= week_ago]

    # Calculate streak
    reading_dates = sorted(set(r.date for r in readings))
    current_streak = 0
    if reading_dates:
        current_date = today
        for reading_date in reversed(reading_dates):
            if reading_date == current_date:
                current_streak += 1
                current_date -= timedelta(days=1)
            else:
                break

    return {
        'current_streak': current_streak,
        'total_readings': len(readings),
        'weekly_readings': len(recent_readings),
        'level': calculate_level(len(readings) * 10)
    }

def calculate_level(points):
    """Calculate user level"""
    if points < 50:
        return {'level': 1, 'title': {'en': 'Beginner', 'sw': 'Mwanzo'}}
    elif points < 150:
        return {'level': 2, 'title': {'en': 'Learner', 'sw': 'Mwanafunzi'}}
    elif points < 300:
        return {'level': 3, 'title': {'en': 'Tracker', 'sw': 'Mfuatiliaji'}}
    else:
        return {'level': 4, 'title': {'en': 'Expert', 'sw': 'Mtaalamu'}}

def check_badges(readings):
    """Check earned badges"""
    badges = []
    if len(readings) >= 1:
        badges.append('first_reading')

    # Check week streak
    reading_dates = sorted(set(r.date for r in readings), reverse=True)
    if len(reading_dates) >= 7:
        consecutive = 1
        for i in range(1, len(reading_dates)):
            if reading_dates[i - 1] - reading_dates[i] == timedelta(days=1):
                consecutive += 1
            else:
                break
        if consecutive >= 7:
            badges.append('week_streak')

    return badges

def get_daily_challenges_status(readings, target_date=None):
    """Get today's challenge status"""
    target_date = target_date or date.today()
    today_readings = [r for r in readings if r.date == target_date]

    return {
        'log_reading': {
            'completed': len(today_readings) >= 1,
            'progress': len(today_readings)
        },
        'morning_check': {
            'completed': any(r.time and r.time.hour < 10 for r in today_readings),
            'progress': 1 if any(r.time and r.time.hour < 10 for r in today_readings) else 0
        }
    }

# ---------------- Nick's In-Memory Points API ----------------

USER_POINTS = {}
USER_BADGES = {}

BADGE_THRESHOLDS = [
    (50, "Starter"),
    (150, "Consistent"),
    (300, "Champion"),
]

def compute_badges(points):
    badges = []
    for threshold, name in BADGE_THRESHOLDS:
        if points >= threshold:
            badges.append(name)
    return badges

class Points(Resource):
    def get(self, user_id):
        user_id = str(user_id)
        pts = USER_POINTS.get(user_id, 0)
        return {"user_id": user_id, "points": pts}, 200

    def post(self, user_id):
        user_id = str(user_id)
        payload = request.get_json(force=True, silent=True) or {}
        delta = int(payload.get("delta") or 0)
        USER_POINTS[user_id] = USER_POINTS.get(user_id, 0) + delta
        # refresh badges on point change
        USER_BADGES[user_id] = compute_badges(USER_POINTS[user_id])
        return {"user_id": user_id, "points": USER_POINTS[user_id]}, 200

class Badges(Resource):
    def get(self, user_id):
        user_id = str(user_id)
        pts = USER_POINTS.get(user_id, 0)
        badges = USER_BADGES.get(user_id) or compute_badges(pts)
        USER_BADGES[user_id] = badges
        return {"user_id": user_id, "badges": badges}, 200
