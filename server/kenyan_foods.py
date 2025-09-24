#!/usr/bin/env python3
"""
Kenyan Food Database with nutritional information
Focused on common foods and their impact on blood glucose
"""

# -----------------------
# SIMPLE DICTIONARY MODEL
# -----------------------

# Kenyan foods with nutritional data (per 100g serving)
KENYAN_FOODS = {
    'ugali': {
        'name_en': 'Ugali',
        'name_sw': 'Ugali',
        'category': 'staple',
        'calories': 112,
        'carbs': 24.0,
        'fiber': 1.2,
        'protein': 2.4,
        'fat': 0.4,
        'glycemic_index': 85,
        'glucose_impact': 'high',
        'diabetes_tips': {
            'en': [
                'Eat smaller portions (1/2 cup instead of 1 cup)',
                'Pair with sukuma wiki or other vegetables',
                'Choose whole grain ugali when possible',
                'Monitor blood sugar 2 hours after eating'
            ],
            'sw': [
                'Kula kipimo kidogo (kikombe 1/2 badala ya 1)',
                'Changanya na sukuma wiki au mboga zingine',
                'Chagua ugali wa nafaka nzima ikiwezekana',
                'Fuatilia sukari ya damu masaa 2 baada ya kula'
            ]
        }
    },
    # ... other foods omitted for brevity ...
}

def get_food_by_name(name):
    """Get food data by name (English or Swahili)"""
    name_lower = name.lower().replace(' ', '_')
    return KENYAN_FOODS.get(name_lower)

def get_foods_by_glucose_impact(impact_level):
    """Get foods by glucose impact level: low, medium, high, very_high, none"""
    return {k: v for k, v in KENYAN_FOODS.items() if v['glucose_impact'] == impact_level}

def get_diabetes_friendly_foods():
    """Get foods with low glucose impact"""
    return get_foods_by_glucose_impact('low') | get_foods_by_glucose_impact('none')

def get_foods_to_limit():
    """Get foods with high glucose impact"""
    return get_foods_by_glucose_impact('high') | get_foods_by_glucose_impact('very_high')

def get_food_recommendations(diabetes_type, language='en'):
    """Get personalized food recommendations based on diabetes type"""
    recommendations = {
        'type1': {
            'en': [
                'Focus on carb counting with ugali and chapati',
                'Sukuma wiki and terere are excellent choices',
                'Time insulin with high-carb foods like githeri',
                'Nyama choma provides protein without affecting blood sugar'
            ],
            'sw': [
                'Zingatia kuhesabu kabohaidreti na ugali na chapati',
                'Sukuma wiki na terere ni chaguo bora',
                'Panga insulini na chakula chenye kabohaidreti nyingi kama githeri',
                'Nyama choma inatoa protini bila kuathiri sukari ya damu'
            ]
        },
        'type2': {
            'en': [
                'Limit ugali and chapati portions',
                'Fill half your plate with sukuma wiki and terere',
                'Choose githeri over ugali for better blood sugar control',
                'Avoid mandazi and other fried foods'
            ],
            'sw': [
                'Punguza vipimo vya ugali na chapati',
                'Jaza nusu ya sahani yako na sukuma wiki na terere',
                'Chagua githeri badala ya ugali kwa kudhibiti sukari vizuri',
                'Epuka mandazi na vyakula vingine vya kukaanga'
            ]
        }
    }
    return recommendations.get(diabetes_type, {}).get(language, [])


# -----------------------
# CLASS-BASED MODEL
# -----------------------

import json
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum

class FoodCategory(Enum):
    STAPLES = "staples"
    VEGETABLES = "vegetables"
    PROTEINS = "proteins"
    FRUITS = "fruits"
    BEVERAGES = "beverages"
    SNACKS = "snacks"
    TRADITIONAL = "traditional"

class GlycemicIndex(Enum):
    LOW = "low"      # GI < 55
    MEDIUM = "medium" # GI 55-70
    HIGH = "high"    # GI > 70

@dataclass
class NutritionalInfo:
    calories_per_100g: float
    carbohydrates_g: float
    protein_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float
    glycemic_index: int
    glycemic_load: float

@dataclass
class KenyanFood:
    id: str
    name_english: str
    name_swahili: str
    name_local: Optional[str]
    category: FoodCategory
    nutritional_info: NutritionalInfo
    description_english: str
    description_swahili: str
    health_benefits: List[str]
    diabetes_friendly: bool
    preparation_tips: List[str]
    serving_size_g: float
    common_combinations: List[str]
    seasonal_availability: List[str]
    regions: List[str]

class KenyanFoodDatabase:
    """Comprehensive database of Kenyan foods with health insights"""
    
    def __init__(self):
        self.foods = self._initialize_database()
        self.food_index = {food.id: food for food in self.foods}
        self.name_index = self._create_name_index()
    
    # full implementation continues …

# Global instance
kenyan_food_db = KenyanFoodDatabase()

def get_kenyan_food_database() -> KenyanFoodDatabase:
    """Get the global Kenyan food database instance"""
    return kenyan_food_db


# -----------------------
# NICK’S FLASK API LAYER
# -----------------------

from flask import request
from flask_restful import Resource
from models import Food as FoodModel

class Foods(Resource):
    def get(self):
        search = request.args.get("search")
        query = FoodModel.query
        if search:
            like = f"%{search}%"
            query = query.filter(FoodModel.name.ilike(like))
        foods = [
            {
                "id": f.id,
                "name": f.name,
                "carbs": f.carbs,
                "gi": f.gi,
                "serving_grams": f.serving_grams,
            }
            for f in query.order_by(FoodModel.name.asc()).all()
        ]
        return foods, 200

class Food(Resource):
    def get(self, food_id):
        f = FoodModel.query.get(food_id)
        if not f:
            return {"error": "Food not found"}, 404
        return {
            "id": f.id,
            "name": f.name,
            "carbs": f.carbs,
            "gi": f.gi,
            "serving_grams": f.serving_grams,
        }, 200
