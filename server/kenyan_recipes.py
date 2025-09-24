"""
Kenyan Recipes Database - Traditional Kenyan recipes with step-by-step instructions,
nutritional analysis, and diabetes-friendly modifications.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
import json

class RecipeCategory(Enum):
    MAIN_DISHES = "main_dishes"
    SIDE_DISHES = "side_dishes"
    BEVERAGES = "beverages"
    SNACKS = "snacks"
    TRADITIONAL = "traditional"
    VEGETARIAN = "vegetarian"

class DifficultyLevel(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

@dataclass
class Ingredient:
    name_english: str
    name_swahili: str
    quantity: str
    unit: str
    diabetes_friendly_substitute: Optional[str] = None

@dataclass
class NutritionalBreakdown:
    calories_per_serving: float
    carbohydrates_g: float
    protein_g: float
    fat_g: float
    fiber_g: float
    sodium_mg: float
    estimated_glycemic_load: float

@dataclass
class KenyanRecipe:
    id: str
    name_english: str
    name_swahili: str
    name_local: Optional[str]
    category: RecipeCategory
    difficulty: DifficultyLevel
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    description_english: str
    description_swahili: str
    ingredients: List[Ingredient]
    instructions_english: List[str]
    instructions_swahili: List[str]
    nutritional_info: NutritionalBreakdown
    diabetes_modifications: List[str]
    cultural_significance: str
    regional_origin: str
    best_season: str
    cooking_tips: List[str]
    storage_instructions: str
    image_url: Optional[str] = None

class KenyanRecipeDatabase:
    """Comprehensive database of traditional Kenyan recipes"""
    
    def __init__(self):
        self.recipes = self._initialize_recipes()
        self.recipe_index = {recipe.id: recipe for recipe in self.recipes}
    
    def _initialize_recipes(self) -> List[KenyanRecipe]:
        """Initialize the database with traditional Kenyan recipes"""
        return [
            # GITHERI RECIPE
            KenyanRecipe(
                id="githeri_traditional",
                name_english="Traditional Githeri",
                name_swahili="Githeri ya Kitamaduni",
                name_local="Mukimo wa mahindi na maharagwe",
                category=RecipeCategory.MAIN_DISHES,
                difficulty=DifficultyLevel.EASY,
                prep_time_minutes=15,
                cook_time_minutes=45,
                servings=6,
                description_english="A nutritious mix of maize and beans, perfect for diabetes management",
                description_swahili="Mchanganyiko wa mahindi na maharagwe wenye virutubisho, mzuri kwa kudhibiti kisukari",
                ingredients=[
                    Ingredient("Dried maize kernels", "Mahindi makavu", "2", "cups"),
                    Ingredient("Red kidney beans", "Maharagwe mekundu", "1", "cup"),
                    Ingredient("Onions", "Vitunguu", "2", "medium", "Use less for lower carbs"),
                    Ingredient("Tomatoes", "Nyanya", "3", "medium"),
                    Ingredient("Cooking oil", "Mafuta ya kupikia", "2", "tablespoons", "Use 1 tbsp or coconut oil"),
                    Ingredient("Salt", "Chumvi", "1", "teaspoon", "Reduce to 1/2 tsp"),
                    Ingredient("Water", "Maji", "4", "cups"),
                    Ingredient("Coriander", "Giligilani", "2", "tablespoons")
                ],
                instructions_english=[
                    "Soak maize and beans overnight in separate bowls",
                    "Drain and rinse both maize and beans",
                    "In a large pot, combine maize and beans with 4 cups water",
                    "Bring to boil, then reduce heat and simmer for 30 minutes",
                    "Heat oil in a pan, sauté onions until golden",
                    "Add tomatoes and cook until soft",
                    "Add the onion-tomato mixture to the pot",
                    "Season with salt and cook for 15 more minutes",
                    "Garnish with fresh coriander before serving"
                ],
                instructions_swahili=[
                    "Lowa mahindi na maharagwe usiku kucha katika bakuli tofauti",
                    "Mwaga na osha mahindi na maharagwe",
                    "Katika sufuria kubwa, changanya mahindi na maharagwe na maji 4",
                    "Leta hadi kuchemka, kisha punguza moto na uchemshe kwa dakika 30",
                    "Pasha mafuta katika karai, kaanga vitunguu hadi kuwa dhahabu",
                    "Ongeza nyanya na upike hadi zilaini",
                    "Ongeza mchanganyiko wa vitunguu na nyanya kwenye sufuria",
                    "Ongeza chumvi na upike kwa dakika 15 zaidi",
                    "Pamba na giligilani mbichi kabla ya kutumikia"
                ],
                nutritional_info=NutritionalBreakdown(
                    calories_per_serving=245,
                    carbohydrates_g=42.0,
                    protein_g=12.5,
                    fat_g=4.2,
                    fiber_g=8.5,
                    sodium_mg=380,
                    estimated_glycemic_load=15.2
                ),
                diabetes_modifications=[
                    "Use smaller portions (3/4 cup instead of 1 cup)",
                    "Add more vegetables like sukuma wiki",
                    "Reduce cooking oil to 1 tablespoon",
                    "Serve with a side salad to add fiber"
                ],
                cultural_significance="Githeri is a staple food among the Kikuyu community and represents unity as it combines two crops that grow well together.",
                regional_origin="Central Kenya",
                best_season="All year round",
                cooking_tips=[
                    "Soak beans and maize overnight for faster cooking",
                    "Add vegetables in the last 10 minutes to retain nutrients",
                    "Can be pressure cooked to reduce cooking time"
                ],
                storage_instructions="Store in refrigerator for up to 3 days. Reheat thoroughly before serving."
            ),
            
            # SUKUMA WIKI RECIPE
            KenyanRecipe(
                id="sukuma_wiki_deluxe",
                name_english="Deluxe Sukuma Wiki",
                name_swahili="Sukuma Wiki Bora",
                name_local="Collard greens special",
                category=RecipeCategory.SIDE_DISHES,
                difficulty=DifficultyLevel.EASY,
                prep_time_minutes=10,
                cook_time_minutes=15,
                servings=4,
                description_english="Nutritious collard greens cooked with traditional spices, excellent for diabetes",
                description_swahili="Sukuma wiki wenye virutubisho uliopikwa na viungo vya kitamaduni, mzuri kwa kisukari",
                ingredients=[
                    Ingredient("Sukuma wiki leaves", "Majani ya sukuma wiki", "1", "bunch"),
                    Ingredient("Onions", "Vitunguu", "1", "medium"),
                    Ingredient("Tomatoes", "Nyanya", "2", "medium"),
                    Ingredient("Garlic", "Kitunguu saumu", "3", "cloves"),
                    Ingredient("Cooking oil", "Mafuta ya kupikia", "1", "tablespoon"),
                    Ingredient("Salt", "Chumvi", "1/2", "teaspoon"),
                    Ingredient("Royco cubes", "Vipande vya Royco", "1", "cube", "Use herbs instead"),
                    Ingredient("Water", "Maji", "1/4", "cup")
                ],
                instructions_english=[
                    "Wash sukuma wiki thoroughly and chop into strips",
                    "Dice onions and tomatoes, mince garlic",
                    "Heat oil in a large pan over medium heat",
                    "Sauté onions until translucent",
                    "Add garlic and cook for 1 minute",
                    "Add tomatoes and cook until soft",
                    "Add sukuma wiki and stir well",
                    "Add water, cover and cook for 8-10 minutes",
                    "Season with salt and serve hot"
                ],
                instructions_swahili=[
                    "Osha sukuma wiki vizuri na ukata vipande vipande",
                    "Kata vitunguu na nyanya vipande vidogo, saga kitunguu saumu",
                    "Pasha mafuta katika karai kubwa kwa moto wa wastani",
                    "Kaanga vitunguu hadi kuwa wazi",
                    "Ongeza kitunguu saumu na upike kwa dakika 1",
                    "Ongeza nyanya na upike hadi zilaini",
                    "Ongeza sukuma wiki na uchanganye vizuri",
                    "Ongeza maji, funika na upike kwa dakika 8-10",
                    "Ongeza chumvi na utumikia ukiwa moto"
                ],
                nutritional_info=NutritionalBreakdown(
                    calories_per_serving=65,
                    carbohydrates_g=8.5,
                    protein_g=4.2,
                    fat_g=3.1,
                    fiber_g=4.8,
                    sodium_mg=245,
                    estimated_glycemic_load=2.1
                ),
                diabetes_modifications=[
                    "Perfect as is - very low glycemic impact",
                    "Add lean protein like chicken strips",
                    "Use minimal oil for cooking",
                    "Serve as main dish with small portion of ugali"
                ],
                cultural_significance="Sukuma wiki literally means 'push the week' as it's an affordable vegetable that helps families stretch their budget.",
                regional_origin="All regions of Kenya",
                best_season="All year round",
                cooking_tips=[
                    "Don't overcook to retain nutrients",
                    "Add vegetables gradually to prevent overcrowding",
                    "Can add groundnuts for extra protein"
                ],
                storage_instructions="Best consumed fresh. Can be stored for 1 day in refrigerator."
            ),
            
            # UGALI RECIPE
            KenyanRecipe(
                id="ugali_perfect",
                name_english="Perfect Ugali",
                name_swahili="Ugali Kamili",
                name_local="Posho",
                category=RecipeCategory.MAIN_DISHES,
                difficulty=DifficultyLevel.MEDIUM,
                prep_time_minutes=5,
                cook_time_minutes=20,
                servings=6,
                description_english="Traditional cornmeal staple, prepared with techniques for better blood sugar control",
                description_swahili="Chakula cha msingi cha unga wa mahindi, kilicho andaliwa kwa njia za kudhibiti sukari vizuri",
                ingredients=[
                    Ingredient("White maize flour", "Unga wa mahindi mweupe", "2", "cups", "Mix with whole grain flour"),
                    Ingredient("Water", "Maji", "3", "cups"),
                    Ingredient("Salt", "Chumvi", "1/2", "teaspoon", "Optional")
                ],
                instructions_english=[
                    "Boil 2 cups of water in a heavy-bottomed pot",
                    "Mix remaining 1 cup cold water with maize flour to make paste",
                    "Add the paste to boiling water while stirring continuously",
                    "Reduce heat to low and cook for 10 minutes, stirring frequently",
                    "Add more flour gradually if mixture is too thin",
                    "Cook until mixture pulls away from sides of pot",
                    "Stir vigorously to remove lumps",
                    "Shape into a mound and serve hot"
                ],
                instructions_swahili=[
                    "Chemsha vikombe 2 vya maji katika sufuria yenye sakafu nzito",
                    "Changanya kikombe 1 cha maji baridi na unga wa mahindi kutengeneza uji",
                    "Ongeza uji kwenye maji yanayochemka ukikoroga bila kukoma",
                    "Punguza moto na upike kwa dakika 10, ukikoroga mara kwa mara",
                    "Ongeza unga kidogo kidogo kama mchanganyiko ni mwembamba sana",
                    "Pika hadi mchanganyiko uanze kujiondoa kwenye kingo za sufuria",
                    "Koroga kwa nguvu kuondoa makonde",
                    "Umba kwa umbo la kilima na utumikia ukiwa moto"
                ],
                nutritional_info=NutritionalBreakdown(
                    calories_per_serving=168,
                    carbohydrates_g=36.2,
                    protein_g=3.8,
                    fat_g=0.6,
                    fiber_g=2.1,
                    sodium_mg=195,
                    estimated_glycemic_load=25.8
                ),
                diabetes_modifications=[
                    "Serve smaller portions (1/2 cup instead of 1 cup)",
                    "Mix white maize flour with whole grain flour (50:50)",
                    "Always serve with high-fiber vegetables",
                    "Eat slowly and chew thoroughly",
                    "Pair with protein-rich foods"
                ],
                cultural_significance="Ugali is the most common staple food in Kenya, eaten across all communities and considered the foundation of a proper meal.",
                regional_origin="All regions of Kenya",
                best_season="All year round",
                cooking_tips=[
                    "Use a wooden spoon for stirring",
                    "Keep water boiling when adding flour paste",
                    "Cook on low heat to prevent burning"
                ],
                storage_instructions="Best eaten fresh. Can be stored for 1 day and reheated with a little water."
            ),
            
            # TRADITIONAL PORRIDGE
            KenyanRecipe(
                id="millet_porridge",
                name_english="Traditional Millet Porridge",
                name_swahili="Uji wa Mtama wa Kitamaduni",
                name_local="Wimbi porridge",
                category=RecipeCategory.BEVERAGES,
                difficulty=DifficultyLevel.EASY,
                prep_time_minutes=10,
                cook_time_minutes=25,
                servings=4,
                description_english="Nutritious traditional porridge with low glycemic index, perfect for diabetes management",
                description_swahili="Uji wa kitamaduni wenye virutubisho na glycemic index ya chini, mzuri kwa kudhibiti kisukari",
                ingredients=[
                    Ingredient("Millet flour", "Unga wa mtama", "1", "cup"),
                    Ingredient("Water", "Maji", "4", "cups"),
                    Ingredient("Ginger", "Tangawizi", "1", "inch piece"),
                    Ingredient("Cinnamon stick", "Mdalasini", "1", "stick"),
                    Ingredient("Honey", "Asali", "2", "tablespoons", "Use stevia or reduce amount"),
                    Ingredient("Milk", "Maziwa", "1/2", "cup", "Use low-fat milk")
                ],
                instructions_english=[
                    "Mix millet flour with 1 cup cold water to make smooth paste",
                    "Boil remaining 3 cups water with ginger and cinnamon",
                    "Add millet paste to boiling water while stirring",
                    "Reduce heat and simmer for 20 minutes, stirring occasionally",
                    "Add milk in the last 5 minutes",
                    "Sweeten with honey to taste",
                    "Strain and serve warm"
                ],
                instructions_swahili=[
                    "Changanya unga wa mtama na kikombe 1 cha maji baridi kutengeneza uji laini",
                    "Chemsha vikombe 3 vya maji na tangawizi na mdalasini",
                    "Ongeza uji wa mtama kwenye maji yanayochemka ukikoroga",
                    "Punguza moto na uchemshe kwa dakika 20, ukikoroga mara kwa mara",
                    "Ongeza maziwa katika dakika 5 za mwisho",
                    "Tamu na asali kulingana na ladha yako",
                    "Chuja na utumikia ukiwa moto"
                ],
                nutritional_info=NutritionalBreakdown(
                    calories_per_serving=145,
                    carbohydrates_g=28.5,
                    protein_g=5.2,
                    fat_g=2.1,
                    fiber_g=3.8,
                    sodium_mg=45,
                    estimated_glycemic_load=12.4
                ),
                diabetes_modifications=[
                    "Use stevia instead of honey",
                    "Add ground flaxseed for extra fiber",
                    "Use unsweetened almond milk",
                    "Serve smaller portions",
                    "Add cinnamon for blood sugar control"
                ],
                cultural_significance="Millet porridge is traditional among pastoral communities and is known for its nutritional benefits and ability to provide sustained energy.",
                regional_origin="Northern and Eastern Kenya",
                best_season="All year round",
                cooking_tips=[
                    "Soak millet overnight for easier digestion",
                    "Stir constantly to prevent lumps",
                    "Can be made with mixed grains for variety"
                ],
                storage_instructions="Can be stored in refrigerator for 2 days. Reheat with additional liquid."
            )
        ]
    
    def get_recipe_by_id(self, recipe_id: str) -> Optional[KenyanRecipe]:
        """Get recipe by ID"""
        return self.recipe_index.get(recipe_id)
    
    def search_recipes(self, query: str) -> List[KenyanRecipe]:
        """Search recipes by name or ingredients"""
        query = query.lower()
        results = []
        
        for recipe in self.recipes:
            if (query in recipe.name_english.lower() or 
                query in recipe.name_swahili.lower() or
                any(query in ingredient.name_english.lower() or 
                    query in ingredient.name_swahili.lower() 
                    for ingredient in recipe.ingredients)):
                results.append(recipe)
        
        return results
    
    def get_recipes_by_category(self, category: RecipeCategory) -> List[KenyanRecipe]:
        """Get recipes by category"""
        return [recipe for recipe in self.recipes if recipe.category == category]
    
    def get_diabetes_friendly_recipes(self) -> List[KenyanRecipe]:
        """Get recipes with low glycemic load"""
        return [recipe for recipe in self.recipes 
                if recipe.nutritional_info.estimated_glycemic_load < 15]
    
    def get_quick_recipes(self, max_time_minutes: int = 30) -> List[KenyanRecipe]:
        """Get recipes that can be prepared quickly"""
        return [recipe for recipe in self.recipes 
                if (recipe.prep_time_minutes + recipe.cook_time_minutes) <= max_time_minutes]
    
    def get_seasonal_recipes(self, season: str) -> List[KenyanRecipe]:
        """Get recipes suitable for a specific season"""
        return [recipe for recipe in self.recipes 
                if season.lower() in recipe.best_season.lower() or 
                "all year" in recipe.best_season.lower()]

# Global instance
kenyan_recipe_db = KenyanRecipeDatabase()

def get_kenyan_recipe_database() -> KenyanRecipeDatabase:
    """Get the global Kenyan recipe database instance"""
    return kenyan_recipe_db
