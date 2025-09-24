"""
Seasonal Foods Tracker - Track Kenyan foods by seasons and availability
Helps users understand when traditional foods are at their peak nutrition and affordability
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, date
import calendar

class KenyanSeason(Enum):
    LONG_RAINS = "long_rains"      # March - May
    DRY_SEASON = "dry_season"      # June - October  
    SHORT_RAINS = "short_rains"    # November - December
    HOT_DRY = "hot_dry"           # January - February

class FoodAvailability(Enum):
    PEAK = "peak"           # Best time - highest nutrition, lowest cost
    AVAILABLE = "available" # Available but not peak
    LIMITED = "limited"     # Limited availability, higher cost
    UNAVAILABLE = "unavailable" # Not available or very expensive

@dataclass
class SeasonalFood:
    id: str
    name_english: str
    name_swahili: str
    category: str
    seasonal_availability: Dict[KenyanSeason, FoodAvailability]
    peak_months: List[int]  # 1-12 for Jan-Dec
    nutritional_peak: str   # When nutrition is highest
    cost_effectiveness: Dict[KenyanSeason, str]  # low, medium, high cost
    storage_tips: List[str]
    preservation_methods: List[str]
    regional_variations: Dict[str, str]  # Different regions, different seasons
    diabetes_benefits_by_season: Dict[KenyanSeason, List[str]]
    traditional_uses: List[str]
    harvest_indicators: List[str]  # How to know when food is ready

class SeasonalFoodTracker:
    """Track seasonal availability of Kenyan foods for optimal nutrition and cost"""
    
    def __init__(self):
        self.seasonal_foods = self._initialize_seasonal_foods()
        self.current_season = self._get_current_season()
    
    def _initialize_seasonal_foods(self) -> List[SeasonalFood]:
        """Initialize database with seasonal Kenyan foods"""
        return [
            # MAIZE (Mahindi)
            SeasonalFood(
                id="maize_fresh",
                name_english="Fresh Maize",
                name_swahili="Mahindi Mapya",
                category="grains",
                seasonal_availability={
                    KenyanSeason.LONG_RAINS: FoodAvailability.PEAK,
                    KenyanSeason.DRY_SEASON: FoodAvailability.LIMITED,
                    KenyanSeason.SHORT_RAINS: FoodAvailability.AVAILABLE,
                    KenyanSeason.HOT_DRY: FoodAvailability.UNAVAILABLE
                },
                peak_months=[4, 5, 6, 11, 12],
                nutritional_peak="Fresh harvest has highest vitamin content",
                cost_effectiveness={
                    KenyanSeason.LONG_RAINS: "low",
                    KenyanSeason.DRY_SEASON: "high", 
                    KenyanSeason.SHORT_RAINS: "medium",
                    KenyanSeason.HOT_DRY: "high"
                },
                storage_tips=[
                    "Store fresh maize in cool, dry place",
                    "Use within 3-5 days of harvest",
                    "Can be boiled and frozen for later use"
                ],
                preservation_methods=[
                    "Drying for long-term storage",
                    "Grinding into flour",
                    "Fermentation for improved nutrition"
                ],
                regional_variations={
                    "Central Kenya": "Peak in May-June",
                    "Western Kenya": "Two peaks: June and December",
                    "Eastern Kenya": "Peak in November-December",
                    "Coast": "Available year-round but peak in December"
                },
                diabetes_benefits_by_season={
                    KenyanSeason.LONG_RAINS: [
                        "Fresh maize has lower glycemic index",
                        "Higher fiber content when fresh",
                        "Better portion control with whole cobs"
                    ],
                    KenyanSeason.DRY_SEASON: [
                        "Dried maize requires more preparation time",
                        "Can be mixed with beans for better nutrition"
                    ]
                },
                traditional_uses=[
                    "Roasted fresh cobs as snacks",
                    "Boiled with beans for githeri",
                    "Ground into flour for ugali"
                ],
                harvest_indicators=[
                    "Kernels are plump and milky",
                    "Husks are green and tight",
                    "Silk is brown and dry"
                ]
            ),
            
            # SUKUMA WIKI
            SeasonalFood(
                id="sukuma_wiki",
                name_english="Collard Greens",
                name_swahili="Sukuma Wiki",
                category="vegetables",
                seasonal_availability={
                    KenyanSeason.LONG_RAINS: FoodAvailability.PEAK,
                    KenyanSeason.DRY_SEASON: FoodAvailability.AVAILABLE,
                    KenyanSeason.SHORT_RAINS: FoodAvailability.PEAK,
                    KenyanSeason.HOT_DRY: FoodAvailability.LIMITED
                },
                peak_months=[3, 4, 5, 11, 12],
                nutritional_peak="Rainy season leaves are more tender and nutritious",
                cost_effectiveness={
                    KenyanSeason.LONG_RAINS: "low",
                    KenyanSeason.DRY_SEASON: "medium",
                    KenyanSeason.SHORT_RAINS: "low", 
                    KenyanSeason.HOT_DRY: "high"
                },
                storage_tips=[
                    "Use fresh within 2-3 days",
                    "Store in refrigerator wrapped in damp cloth",
                    "Can be blanched and frozen"
                ],
                preservation_methods=[
                    "Sun-drying for traditional preservation",
                    "Blanching and freezing",
                    "Fermentation (traditional method)"
                ],
                regional_variations={
                    "Central Kenya": "Available year-round",
                    "Western Kenya": "Peak during rains",
                    "Eastern Kenya": "Limited during dry season",
                    "Northern Kenya": "Mainly during rainy seasons"
                },
                diabetes_benefits_by_season={
                    KenyanSeason.LONG_RAINS: [
                        "Highest antioxidant content",
                        "More tender, easier to digest",
                        "Lower cost allows for larger portions"
                    ],
                    KenyanSeason.DRY_SEASON: [
                        "Still excellent for blood sugar control",
                        "Pair with other seasonal vegetables"
                    ]
                },
                traditional_uses=[
                    "Sautéed with onions and tomatoes",
                    "Added to githeri for nutrition",
                    "Used in traditional stews"
                ],
                harvest_indicators=[
                    "Leaves are dark green and crisp",
                    "No yellowing or wilting",
                    "Stems are firm and not woody"
                ]
            ),
            
            # MANGOES
            SeasonalFood(
                id="mangoes",
                name_english="Mangoes",
                name_swahili="Maembe",
                category="fruits",
                seasonal_availability={
                    KenyanSeason.LONG_RAINS: FoodAvailability.UNAVAILABLE,
                    KenyanSeason.DRY_SEASON: FoodAvailability.PEAK,
                    KenyanSeason.SHORT_RAINS: FoodAvailability.LIMITED,
                    KenyanSeason.HOT_DRY: FoodAvailability.PEAK
                },
                peak_months=[12, 1, 2, 3],
                nutritional_peak="Tree-ripened mangoes have highest vitamin content",
                cost_effectiveness={
                    KenyanSeason.LONG_RAINS: "unavailable",
                    KenyanSeason.DRY_SEASON: "low",
                    KenyanSeason.SHORT_RAINS: "high",
                    KenyanSeason.HOT_DRY: "low"
                },
                storage_tips=[
                    "Store ripe mangoes in refrigerator for 3-5 days",
                    "Unripe mangoes ripen at room temperature",
                    "Can be cut and frozen for smoothies"
                ],
                preservation_methods=[
                    "Sun-drying into mango leather",
                    "Freezing cut pieces",
                    "Making into jam or chutney"
                ],
                regional_variations={
                    "Coast": "Peak December-March",
                    "Eastern Kenya": "Peak January-February", 
                    "Central Kenya": "Limited season, mainly January",
                    "Western Kenya": "Peak February-March"
                },
                diabetes_benefits_by_season={
                    KenyanSeason.DRY_SEASON: [
                        "Natural sugars provide quick energy",
                        "High fiber helps slow sugar absorption",
                        "Portion control easier with whole fruit"
                    ],
                    KenyanSeason.HOT_DRY: [
                        "Provides hydration during hot weather",
                        "Natural antioxidants support health"
                    ]
                },
                traditional_uses=[
                    "Eaten fresh as dessert",
                    "Made into juice (dilute for diabetes)",
                    "Used in traditional fruit salads"
                ],
                harvest_indicators=[
                    "Fruit gives slightly to gentle pressure",
                    "Sweet aroma at stem end",
                    "Color changes from green to yellow/red"
                ]
            ),
            
            # SWEET POTATOES
            SeasonalFood(
                id="sweet_potatoes",
                name_english="Sweet Potatoes",
                name_swahili="Viazi Vitamu",
                category="tubers",
                seasonal_availability={
                    KenyanSeason.LONG_RAINS: FoodAvailability.AVAILABLE,
                    KenyanSeason.DRY_SEASON: FoodAvailability.PEAK,
                    KenyanSeason.SHORT_RAINS: FoodAvailability.AVAILABLE,
                    KenyanSeason.HOT_DRY: FoodAvailability.LIMITED
                },
                peak_months=[6, 7, 8, 9],
                nutritional_peak="Freshly harvested have highest beta-carotene",
                cost_effectiveness={
                    KenyanSeason.LONG_RAINS: "medium",
                    KenyanSeason.DRY_SEASON: "low",
                    KenyanSeason.SHORT_RAINS: "medium",
                    KenyanSeason.HOT_DRY: "high"
                },
                storage_tips=[
                    "Store in cool, dark, well-ventilated place",
                    "Don't refrigerate - causes hard spots",
                    "Can last 2-3 weeks when stored properly"
                ],
                preservation_methods=[
                    "Sun-drying in slices",
                    "Making into flour",
                    "Fermentation for improved nutrition"
                ],
                regional_variations={
                    "Central Kenya": "Peak July-August",
                    "Western Kenya": "Two seasons: July and December",
                    "Eastern Kenya": "Peak August-September",
                    "Coast": "Available year-round"
                },
                diabetes_benefits_by_season={
                    KenyanSeason.DRY_SEASON: [
                        "Lower glycemic index than regular potatoes",
                        "High fiber content aids blood sugar control",
                        "Orange varieties rich in antioxidants"
                    ],
                    KenyanSeason.LONG_RAINS: [
                        "Good alternative to other starches",
                        "Provides sustained energy"
                    ]
                },
                traditional_uses=[
                    "Boiled as main dish",
                    "Roasted over open fire",
                    "Made into traditional porridge"
                ],
                harvest_indicators=[
                    "Vines start to yellow",
                    "Tubers are firm when dug",
                    "Skin is smooth and unblemished"
                ]
            ),
            
            # PUMPKIN LEAVES
            SeasonalFood(
                id="pumpkin_leaves",
                name_english="Pumpkin Leaves",
                name_swahili="Majani ya Malenge",
                category="vegetables",
                seasonal_availability={
                    KenyanSeason.LONG_RAINS: FoodAvailability.PEAK,
                    KenyanSeason.DRY_SEASON: FoodAvailability.LIMITED,
                    KenyanSeason.SHORT_RAINS: FoodAvailability.AVAILABLE,
                    KenyanSeason.HOT_DRY: FoodAvailability.UNAVAILABLE
                },
                peak_months=[4, 5, 6],
                nutritional_peak="Young leaves during rainy season are most nutritious",
                cost_effectiveness={
                    KenyanSeason.LONG_RAINS: "low",
                    KenyanSeason.DRY_SEASON: "high",
                    KenyanSeason.SHORT_RAINS: "medium",
                    KenyanSeason.HOT_DRY: "unavailable"
                },
                storage_tips=[
                    "Use fresh within 1-2 days",
                    "Store in refrigerator in plastic bag",
                    "Can be blanched and frozen"
                ],
                preservation_methods=[
                    "Sun-drying for traditional storage",
                    "Blanching and freezing",
                    "Salt preservation (traditional method)"
                ],
                regional_variations={
                    "Western Kenya": "Peak during long rains",
                    "Central Kenya": "Available April-June",
                    "Eastern Kenya": "Limited to rainy seasons",
                    "Coast": "Available during both rain seasons"
                },
                diabetes_benefits_by_season={
                    KenyanSeason.LONG_RAINS: [
                        "Extremely low glycemic index",
                        "High in minerals and vitamins",
                        "Excellent for blood sugar control"
                    ]
                },
                traditional_uses=[
                    "Cooked like spinach",
                    "Added to traditional stews",
                    "Mixed with groundnut paste"
                ],
                harvest_indicators=[
                    "Young tender leaves are best",
                    "Avoid old, tough leaves",
                    "Pick in early morning for freshness"
                ]
            )
        ]
    
    def _get_current_season(self) -> KenyanSeason:
        """Determine current Kenyan season based on month"""
        current_month = datetime.now().month
        
        if current_month in [3, 4, 5]:
            return KenyanSeason.LONG_RAINS
        elif current_month in [6, 7, 8, 9, 10]:
            return KenyanSeason.DRY_SEASON
        elif current_month in [11, 12]:
            return KenyanSeason.SHORT_RAINS
        else:  # January, February
            return KenyanSeason.HOT_DRY
    
    def get_current_season_foods(self) -> List[SeasonalFood]:
        """Get foods that are in peak season now"""
        current_season = self._get_current_season()
        return [food for food in self.seasonal_foods 
                if food.seasonal_availability[current_season] == FoodAvailability.PEAK]
    
    def get_foods_by_season(self, season: KenyanSeason) -> Dict[FoodAvailability, List[SeasonalFood]]:
        """Get foods organized by availability for a specific season"""
        result = {availability: [] for availability in FoodAvailability}
        
        for food in self.seasonal_foods:
            availability = food.seasonal_availability[season]
            result[availability].append(food)
        
        return result
    
    def get_foods_by_month(self, month: int) -> List[SeasonalFood]:
        """Get foods that are in peak season for a specific month"""
        return [food for food in self.seasonal_foods if month in food.peak_months]
    
    def get_diabetes_friendly_seasonal_foods(self, season: KenyanSeason = None) -> List[SeasonalFood]:
        """Get foods that are particularly good for diabetes in current/specified season"""
        target_season = season or self._get_current_season()
        
        return [food for food in self.seasonal_foods 
                if (food.seasonal_availability[target_season] in [FoodAvailability.PEAK, FoodAvailability.AVAILABLE] 
                    and target_season in food.diabetes_benefits_by_season)]
    
    def get_cost_effective_foods(self, season: KenyanSeason = None) -> List[SeasonalFood]:
        """Get foods that are cost-effective in current/specified season"""
        target_season = season or self._get_current_season()
        
        return [food for food in self.seasonal_foods 
                if food.cost_effectiveness[target_season] == "low"]
    
    def get_seasonal_meal_suggestions(self, season: KenyanSeason = None) -> Dict[str, List[str]]:
        """Get meal suggestions based on seasonal food availability"""
        target_season = season or self._get_current_season()
        available_foods = self.get_foods_by_season(target_season)
        
        peak_foods = available_foods[FoodAvailability.PEAK]
        available_foods_list = available_foods[FoodAvailability.AVAILABLE]
        
        suggestions = {
            "breakfast": [],
            "lunch": [], 
            "dinner": [],
            "snacks": []
        }
        
        # Generate suggestions based on available foods
        for food in peak_foods + available_foods_list:
            if food.category == "fruits":
                suggestions["breakfast"].append(f"Fresh {food.name_english}")
                suggestions["snacks"].append(f"{food.name_english} slices")
            elif food.category == "vegetables":
                suggestions["lunch"].append(f"{food.name_english} with ugali")
                suggestions["dinner"].append(f"Stewed {food.name_english}")
            elif food.category == "grains":
                suggestions["lunch"].append(f"{food.name_english} githeri")
                suggestions["dinner"].append(f"{food.name_english} based meal")
        
        return suggestions
    
    def get_preservation_calendar(self) -> Dict[int, List[Dict]]:
        """Get a calendar of when to preserve different foods"""
        calendar_data = {}
        
        for month in range(1, 13):
            month_foods = self.get_foods_by_month(month)
            calendar_data[month] = []
            
            for food in month_foods:
                calendar_data[month].append({
                    "food": food.name_english,
                    "swahili": food.name_swahili,
                    "preservation_methods": food.preservation_methods,
                    "storage_tips": food.storage_tips
                })
        
        return calendar_data
    
    def get_regional_availability(self, region: str) -> List[Dict]:
        """Get food availability for a specific region"""
        regional_foods = []
        
        for food in self.seasonal_foods:
            if region in food.regional_variations:
                regional_foods.append({
                    "food": food.name_english,
                    "swahili": food.name_swahili,
                    "availability": food.regional_variations[region],
                    "category": food.category
                })
        
        return regional_foods
    
    def get_seasonal_nutrition_tips(self, season: KenyanSeason = None) -> List[str]:
        """Get nutrition tips specific to current/specified season"""
        target_season = season or self._get_current_season()
        
        tips = []
        seasonal_foods = self.get_current_season_foods() if not season else self.get_foods_by_season(target_season)[FoodAvailability.PEAK]
        
        for food in seasonal_foods:
            if target_season in food.diabetes_benefits_by_season:
                tips.extend(food.diabetes_benefits_by_season[target_season])
        
        # Add general seasonal tips
        if target_season == KenyanSeason.DRY_SEASON:
            tips.extend([
                "Focus on stored grains and preserved vegetables",
                "Increase water intake during dry weather",
                "Take advantage of peak mango season for vitamin C"
            ])
        elif target_season == KenyanSeason.LONG_RAINS:
            tips.extend([
                "Enjoy fresh vegetables at their nutritional peak",
                "Take advantage of lower food costs",
                "Focus on fresh, unprocessed foods"
            ])
        
        return list(set(tips))  # Remove duplicates

# Global instance
seasonal_food_tracker = SeasonalFoodTracker()

def get_seasonal_food_tracker() -> SeasonalFoodTracker:
    """Get the global seasonal food tracker instance"""
    return seasonal_food_tracker
