#!/usr/bin/env python3
"""
Kenyan Food Database with nutritional information
Focused on common foods and their impact on blood glucose
"""

# Kenyan foods with nutritional data (per 100g serving)
KENYAN_FOODS = {
    'ugali': {
        'name_en': 'Ugali',
        'name_sw': 'Ugali',
        'category': 'staple',
        'calories': 112,
        'carbs': 24.0,  # High carb - will spike glucose
        'fiber': 1.2,
        'protein': 2.4,
        'fat': 0.4,
        'glycemic_index': 85,  # High GI
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
    
    'sukuma_wiki': {
        'name_en': 'Sukuma Wiki (Collard Greens)',
        'name_sw': 'Sukuma Wiki',
        'category': 'vegetable',
        'calories': 32,
        'carbs': 5.4,  # Low carb - diabetes friendly
        'fiber': 4.0,
        'protein': 3.0,
        'fat': 0.6,
        'glycemic_index': 15,  # Very low GI
        'glucose_impact': 'low',
        'diabetes_tips': {
            'en': [
                'Excellent choice for diabetes - eat freely',
                'Rich in fiber which helps control blood sugar',
                'Cook with minimal oil',
                'Great side dish to balance high-carb foods'
            ],
            'sw': [
                'Chaguo bora kwa kisukari - kula bila wasiwasi',
                'Ina nyuzi nyingi zinazosaidia kudhibiti sukari ya damu',
                'Pika kwa mafuta machache',
                'Mboga nzuri ya kuongeza chakula chenye kabohaidreti nyingi'
            ]
        }
    },
    
    'chapati': {
        'name_en': 'Chapati',
        'name_sw': 'Chapati',
        'category': 'bread',
        'calories': 297,
        'carbs': 43.0,  # High carb
        'fiber': 1.8,
        'protein': 8.1,
        'fat': 10.4,
        'glycemic_index': 62,  # Medium-high GI
        'glucose_impact': 'high',
        'diabetes_tips': {
            'en': [
                'Limit to 1 small chapati per meal',
                'Choose whole wheat chapati over white flour',
                'Eat with protein and vegetables',
                'Consider alternatives like cauliflower roti'
            ],
            'sw': [
                'Jizuie kwa chapati moja ndogo kwa chakula',
                'Chagua chapati ya ngano nzima badala ya unga mweupe',
                'Kula na protini na mboga',
                'Fikiria mbadala kama roti ya cauliflower'
            ]
        }
    },
    
    'githeri': {
        'name_en': 'Githeri (Maize & Beans)',
        'name_sw': 'Githeri',
        'category': 'legume_grain',
        'calories': 130,
        'carbs': 22.0,
        'fiber': 6.2,  # High fiber - good for diabetes
        'protein': 6.8,
        'fat': 1.2,
        'glycemic_index': 45,  # Medium GI
        'glucose_impact': 'medium',
        'diabetes_tips': {
            'en': [
                'Good protein and fiber combination',
                'Portion control is key - 1 cup maximum',
                'Add vegetables to increase fiber',
                'Better choice than ugali alone'
            ],
            'sw': [
                'Mchanganyiko mzuri wa protini na nyuzi',
                'Kudhibiti kipimo ni muhimu - kikombe 1 tu',
                'Ongeza mboga ili kuongeza nyuzi',
                'Chaguo bora kuliko ugali peke yake'
            ]
        }
    },
    
    'nyama_choma': {
        'name_en': 'Nyama Choma (Grilled Meat)',
        'name_sw': 'Nyama Choma',
        'category': 'protein',
        'calories': 250,
        'carbs': 0.0,  # No carbs - diabetes friendly
        'fiber': 0.0,
        'protein': 26.0,
        'fat': 15.0,
        'glycemic_index': 0,  # No glucose impact
        'glucose_impact': 'none',
        'diabetes_tips': {
            'en': [
                'Excellent protein source with no carbs',
                'Choose lean cuts when possible',
                'Limit processed meats',
                'Great with vegetable sides'
            ],
            'sw': [
                'Chanzo bora cha protini bila kabohaidreti',
                'Chagua sehemu zenye mafuta machache ikiwezekana',
                'Punguza nyama zilizosindikwa',
                'Nzuri na mboga za pembeni'
            ]
        }
    },
    
    'mandazi': {
        'name_en': 'Mandazi',
        'name_sw': 'Mandazi',
        'category': 'snack',
        'calories': 378,
        'carbs': 45.0,  # High carb + high fat = very high glucose impact
        'fiber': 1.5,
        'protein': 7.2,
        'fat': 18.0,
        'glycemic_index': 75,  # High GI
        'glucose_impact': 'very_high',
        'diabetes_tips': {
            'en': [
                'Avoid or eat very rarely',
                'If eating, limit to 1/2 piece maximum',
                'Check blood sugar frequently after eating',
                'Consider healthier alternatives like nuts'
            ],
            'sw': [
                'Epuka au kula mara chache sana',
                'Ukikula, jizuie kwa kipande 1/2 tu',
                'Angalia sukari ya damu mara kwa mara baada ya kula',
                'Fikiria mbadala mzuri kama karanga'
            ]
        }
    },
    
    'sweet_potato': {
        'name_en': 'Sweet Potato (Viazi Vitamu)',
        'name_sw': 'Viazi Vitamu',
        'category': 'tuber',
        'calories': 86,
        'carbs': 20.0,
        'fiber': 3.0,
        'protein': 1.6,
        'fat': 0.1,
        'glycemic_index': 54,  # Medium GI
        'glucose_impact': 'medium',
        'diabetes_tips': {
            'en': [
                'Better choice than regular potatoes',
                'Eat with skin for more fiber',
                'Limit portion to 1 medium potato',
                'Boil or bake instead of frying'
            ],
            'sw': [
                'Chaguo bora kuliko viazi vya kawaida',
                'Kula na ganda kwa nyuzi zaidi',
                'Jizuie kwa kiazi kimoja cha kati',
                'Chemsha au oka badala ya kukaanga'
            ]
        }
    },
    
    'terere': {
        'name_en': 'Terere (Amaranth Leaves)',
        'name_sw': 'Terere',
        'category': 'vegetable',
        'calories': 23,
        'carbs': 4.0,
        'fiber': 3.0,
        'protein': 2.5,
        'fat': 0.3,
        'glycemic_index': 15,  # Very low GI
        'glucose_impact': 'low',
        'diabetes_tips': {
            'en': [
                'Excellent diabetes-friendly vegetable',
                'High in nutrients, low in carbs',
                'Eat freely as side dish',
                'Rich in antioxidants'
            ],
            'sw': [
                'Mboga bora sana kwa kisukari',
                'Ina virutubisho vingi, kabohaidreti chache',
                'Kula bila wasiwasi kama mboga ya pembeni',
                'Ina antioxidants nyingi'
            ]
        }
    }
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

