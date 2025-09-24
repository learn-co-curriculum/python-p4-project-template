"""Provides critical emergency services integration, location-based hospital finder,
and emergency contact cascade system for diabetes emergencies.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json
import math
from datetime import datetime, timedelta

class EmergencyType(Enum):
    SEVERE_HYPOGLYCEMIA = "severe_hypoglycemia"  # Very low blood sugar
    SEVERE_HYPERGLYCEMIA = "severe_hyperglycemia"  # Very high blood sugar
    DIABETIC_KETOACIDOSIS = "diabetic_ketoacidosis"  # DKA
    UNCONSCIOUS = "unconscious"
    CHEST_PAIN = "chest_pain"
    DIFFICULTY_BREATHING = "difficulty_breathing"
    SEVERE_DEHYDRATION = "severe_dehydration"
    MEDICATION_REACTION = "medication_reaction"
    GENERAL_EMERGENCY = "general_emergency"

class EmergencyPriority(Enum):
    CRITICAL = "critical"  # Life-threatening, call 999 immediately
    HIGH = "high"  # Urgent medical attention needed
    MEDIUM = "medium"  # Medical attention needed soon
    LOW = "low"  # Can wait but should see doctor

@dataclass
class EmergencyProtocol:
    emergency_type: EmergencyType
    priority: EmergencyPriority
    immediate_actions_english: List[str]
    immediate_actions_swahili: List[str]
    warning_signs_english: List[str]
    warning_signs_swahili: List[str]
    when_to_call_999: str
    when_to_call_doctor: str
    prevention_tips_english: List[str]
    prevention_tips_swahili: List[str]

@dataclass
class EmergencyContact:
    contact_type: str
    name: str
    phone_number: str
    relationship: str
    priority_order: int
    can_receive_sms: bool
    preferred_language: str

@dataclass
class EmergencyHospital:
    id: str
    name: str
    location: str
    county: str
    coordinates: Tuple[float, float]
    phone_number: str
    emergency_phone: str
    has_diabetes_specialist: bool
    has_icu: bool
    has_emergency_room: bool
    nhif_accredited: bool
    estimated_response_time_minutes: int
    languages_supported: List[str]

@dataclass
class EmergencyResponse:
    emergency_id: str
    user_id: str
    emergency_type: EmergencyType
    severity_level: int  # 1-10 scale
    user_location: Optional[Tuple[float, float]]
    timestamp: datetime
    nearest_hospitals: List[EmergencyHospital]
    contacts_notified: List[str]
    protocol_followed: EmergencyProtocol
    resolution_status: str

class KenyanEmergencyResponseSystem:
    """Comprehensive emergency response system for Kenyan diabetes patients"""
    
    def __init__(self):
        self.emergency_protocols = self._initialize_protocols()
        self.emergency_hospitals = self._initialize_hospitals()
        self.national_emergency_numbers = self._initialize_emergency_numbers()
        self.active_emergencies = {}
    
    def _initialize_protocols(self) -> Dict[EmergencyType, EmergencyProtocol]:
        """Initialize emergency protocols for different diabetes emergencies"""
        return {
            EmergencyType.SEVERE_HYPOGLYCEMIA: EmergencyProtocol(
                emergency_type=EmergencyType.SEVERE_HYPOGLYCEMIA,
                priority=EmergencyPriority.CRITICAL,
                immediate_actions_english=[
                    "Give 15-20g of fast-acting carbs (glucose tablets, honey, or sugar)",
                    "If unconscious, DO NOT give anything by mouth",
                    "Place person in recovery position if unconscious",
                    "Stay with the person and monitor breathing",
                    "Call 999 if person doesn't improve in 15 minutes"
                ],
                immediate_actions_swahili=[
                    "Mpe kabohaidreti za haraka (vidonge vya glukosi, asali, au sukari)",
                    "Kama amezimia, USIMPE chochote kinywani",
                    "Mweke katika hali ya kupona kama amezimia",
                    "Kaa naye na ufuatilie upumuaji wake",
                    "Piga 999 kama hajapona ndani ya dakika 15"
                ],
                warning_signs_english=[
                    "Blood sugar below 70 mg/dL",
                    "Confusion or irritability",
                    "Sweating and shaking",
                    "Fast heartbeat",
                    "Difficulty speaking",
                    "Loss of consciousness"
                ],
                warning_signs_swahili=[
                    "Sukari ya damu chini ya 70 mg/dL",
                    "Kuchanganyikiwa au kukasirika",
                    "Kutokwa na jasho na kutetemeka",
                    "Mapigo ya moyo ya haraka",
                    "Shida ya kuzungumza",
                    "Kupoteza fahamu"
                ],
                when_to_call_999="If person is unconscious, having seizures, or not improving after treatment",
                when_to_call_doctor="If episodes happen frequently or blood sugar won't stabilize",
                prevention_tips_english=[
                    "Eat regular meals and snacks",
                    "Monitor blood sugar regularly",
                    "Adjust medication with doctor's guidance",
                    "Always carry glucose tablets",
                    "Educate family about hypoglycemia"
                ],
                prevention_tips_swahili=[
                    "Kula vyakula na vitafunio vya kawaida",
                    "Pima sukari ya damu mara kwa mara",
                    "Rekebisha dawa kwa ushauri wa daktari",
                    "Beba vidonge vya glukosi kila wakati",
                    "Fundisha familia kuhusu sukari ya chini"
                ]
            ),
            
            EmergencyType.SEVERE_HYPERGLYCEMIA: EmergencyProtocol(
                emergency_type=EmergencyType.SEVERE_HYPERGLYCEMIA,
                priority=EmergencyPriority.HIGH,
                immediate_actions_english=[
                    "Check blood sugar - if over 400 mg/dL, seek immediate medical help",
                    "Drink water to prevent dehydration",
                    "Take prescribed insulin if available",
                    "Check for ketones in urine if possible",
                    "Do NOT exercise with high blood sugar"
                ],
                immediate_actions_swahili=[
                    "Pima sukari - kama ni zaidi ya 400 mg/dL, tafuta msaada wa haraka",
                    "Nywa maji kuzuia ukame",
                    "Chukua insulini uliyoagiziwa kama unazo",
                    "Angalia ketoni katika mkojo ikiwezekana",
                    "USIFANYE mazoezi ukiwa na sukari ya juu"
                ],
                warning_signs_english=[
                    "Blood sugar over 300 mg/dL",
                    "Excessive thirst and urination",
                    "Nausea and vomiting",
                    "Fruity breath odor",
                    "Rapid breathing",
                    "Confusion or drowsiness"
                ],
                warning_signs_swahili=[
                    "Sukari ya damu zaidi ya 300 mg/dL",
                    "Kiu na kukojoa kupita kiasi",
                    "Kichefuchefu na kutapika",
                    "Harufu ya matunda puani",
                    "Kupumua haraka",
                    "Kuchanganyikiwa au kusinzia"
                ],
                when_to_call_999="If vomiting, severe dehydration, or signs of diabetic ketoacidosis",
                when_to_call_doctor="If blood sugar consistently over 250 mg/dL despite medication",
                prevention_tips_english=[
                    "Take medications as prescribed",
                    "Monitor blood sugar regularly",
                    "Follow meal plan",
                    "Stay hydrated",
                    "Manage stress levels"
                ],
                prevention_tips_swahili=[
                    "Chukua dawa kama ulivyoagiziwa",
                    "Pima sukari mara kwa mara",
                    "Fuata mpango wa chakula",
                    "Kuwa na maji ya kutosha mwilini",
                    "Dhibiti msongo wa mawazo"
                ]
            ),
            
            EmergencyType.DIABETIC_KETOACIDOSIS: EmergencyProtocol(
                emergency_type=EmergencyType.DIABETIC_KETOACIDOSIS,
                priority=EmergencyPriority.CRITICAL,
                immediate_actions_english=[
                    "Call 999 IMMEDIATELY - this is life-threatening",
                    "Do not give insulin without medical supervision",
                    "Keep person conscious and breathing",
                    "Prepare to give medical history to paramedics",
                    "Do not give food or water if vomiting"
                ],
                immediate_actions_swahili=[
                    "Piga 999 MARA MOJA - hii ni hatari ya maisha",
                    "Usimpe insulini bila usimamizi wa kimatibabu",
                    "Mweke awe na fahamu na apumue",
                    "Jiandae kumpa historia ya kimatibabu kwa wahudumu",
                    "Usimpe chakula au maji kama anatapika"
                ],
                warning_signs_english=[
                    "Very high blood sugar (over 400 mg/dL)",
                    "Ketones in urine",
                    "Fruity breath smell",
                    "Rapid, deep breathing",
                    "Severe nausea and vomiting",
                    "Severe dehydration",
                    "Confusion or loss of consciousness"
                ],
                warning_signs_swahili=[
                    "Sukari ya damu ya juu sana (zaidi ya 400 mg/dL)",
                    "Ketoni katika mkojo",
                    "Harufu ya matunda puani",
                    "Kupumua haraka na kwa kina",
                    "Kichefuchefu na kutapika kwingi",
                    "Ukame mkuu",
                    "Kuchanganyikiwa au kupoteza fahamu"
                ],
                when_to_call_999="IMMEDIATELY - DKA is always a medical emergency",
                when_to_call_doctor="For prevention strategies and medication adjustments",
                prevention_tips_english=[
                    "Never skip insulin doses",
                    "Monitor blood sugar during illness",
                    "Check ketones when blood sugar is high",
                    "Stay hydrated during illness",
                    "Have a sick day management plan"
                ],
                prevention_tips_swahili=[
                    "Kamwe usisahau kipimo cha insulini",
                    "Pima sukari wakati wa ugonjwa",
                    "Angalia ketoni wakati sukari ni ya juu",
                    "Kuwa na maji ya kutosha wakati wa ugonjwa",
                    "Kuwa na mpango wa kusimamia siku za ugonjwa"
                ]
            )
        }
    
    def _initialize_hospitals(self) -> List[EmergencyHospital]:
        """Initialize emergency hospitals across Kenya"""
        return [
            EmergencyHospital(
                id="knh_emergency",
                name="Kenyatta National Hospital Emergency",
                location="Upper Hill, Nairobi",
                county="Nairobi",
                coordinates=(-1.3013, 36.8073),
                phone_number="+254 20 2726300",
                emergency_phone="+254 20 2726300",
                has_diabetes_specialist=True,
                has_icu=True,
                has_emergency_room=True,
                nhif_accredited=True,
                estimated_response_time_minutes=15,
                languages_supported=["English", "Swahili", "Kikuyu"]
            ),
            
            EmergencyHospital(
                id="nairobi_hospital_emergency",
                name="The Nairobi Hospital Emergency",
                location="Argwings Kodhek Road, Nairobi",
                county="Nairobi",
                coordinates=(-1.2921, 36.7872),
                phone_number="+254 20 2845000",
                emergency_phone="+254 20 2845000",
                has_diabetes_specialist=True,
                has_icu=True,
                has_emergency_room=True,
                nhif_accredited=True,
                estimated_response_time_minutes=10,
                languages_supported=["English", "Swahili"]
            ),
            
            EmergencyHospital(
                id="coast_general_emergency",
                name="Coast General Hospital Emergency",
                location="Mombasa",
                county="Mombasa",
                coordinates=(-4.0435, 39.6682),
                phone_number="+254 41 2312191",
                emergency_phone="+254 41 2312191",
                has_diabetes_specialist=True,
                has_icu=True,
                has_emergency_room=True,
                nhif_accredited=True,
                estimated_response_time_minutes=20,
                languages_supported=["English", "Swahili", "Arabic"]
            ),
            
            EmergencyHospital(
                id="jootrh_emergency",
                name="JOOTRH Emergency Department",
                location="Kisumu",
                county="Kisumu",
                coordinates=(-0.0917, 34.7680),
                phone_number="+254 57 2025555",
                emergency_phone="+254 57 2025555",
                has_diabetes_specialist=True,
                has_icu=True,
                has_emergency_room=True,
                nhif_accredited=True,
                estimated_response_time_minutes=18,
                languages_supported=["English", "Swahili", "Luo"]
            ),
            
            EmergencyHospital(
                id="nakuru_emergency",
                name="Nakuru Level 5 Hospital Emergency",
                location="Nakuru",
                county="Nakuru",
                coordinates=(-0.3031, 36.0800),
                phone_number="+254 51 2213349",
                emergency_phone="+254 51 2213349",
                has_diabetes_specialist=False,
                has_icu=False,
                has_emergency_room=True,
                nhif_accredited=True,
                estimated_response_time_minutes=25,
                languages_supported=["English", "Swahili", "Kikuyu"]
            )
        ]
    
    def _initialize_emergency_numbers(self) -> Dict[str, str]:
        """Initialize Kenyan emergency contact numbers"""
        return {
            "national_emergency": "999",
            "police": "999",
            "ambulance": "999", 
            "fire_brigade": "999",
            "kenya_red_cross": "1199",
            "st_john_ambulance": "+254 20 2210000",
            "diabetes_helpline": "0800 724 000",
            "poison_control": "+254 20 2725911",
            "nhif_emergency": "0800 720 601"
        }
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points in kilometers"""
        R = 6371  # Earth's radius in kilometers
        
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)
        
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def find_nearest_hospitals(self, user_lat: float, user_lon: float, max_distance_km: float = 50) -> List[Tuple[EmergencyHospital, float]]:
        """Find nearest emergency hospitals to user location"""
        hospitals_with_distance = []
        
        for hospital in self.emergency_hospitals:
            distance = self.calculate_distance(
                user_lat, user_lon,
                hospital.coordinates[0], hospital.coordinates[1]
            )
            
            if distance <= max_distance_km:
                hospitals_with_distance.append((hospital, distance))
        
        # Sort by distance, prioritize those with diabetes specialists
        hospitals_with_distance.sort(key=lambda x: (x[1], not x[0].has_diabetes_specialist))
        return hospitals_with_distance[:5]  # Return top 5
    
    def trigger_emergency_response(self, 
                                 user_id: str,
                                 emergency_type: EmergencyType,
                                 severity_level: int,
                                 user_location: Optional[Tuple[float, float]] = None,
                                 emergency_contacts: List[EmergencyContact] = None) -> EmergencyResponse:
        """Trigger comprehensive emergency response"""
        
        emergency_id = f"EMG_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Get appropriate protocol
        protocol = self.emergency_protocols.get(emergency_type)
        if not protocol:
            protocol = self.emergency_protocols[EmergencyType.GENERAL_EMERGENCY]
        
        # Find nearest hospitals if location provided
        nearest_hospitals = []
        if user_location:
            hospital_distances = self.find_nearest_hospitals(user_location[0], user_location[1])
            nearest_hospitals = [hospital for hospital, distance in hospital_distances]
        
        # Notify emergency contacts
        contacts_notified = []
        if emergency_contacts and protocol.priority in [EmergencyPriority.CRITICAL, EmergencyPriority.HIGH]:
            contacts_notified = self._notify_emergency_contacts(emergency_contacts, emergency_type, user_location)
        
        # Create emergency response
        emergency_response = EmergencyResponse(
            emergency_id=emergency_id,
            user_id=user_id,
            emergency_type=emergency_type,
            severity_level=severity_level,
            user_location=user_location,
            timestamp=datetime.now(),
            nearest_hospitals=nearest_hospitals,
            contacts_notified=contacts_notified,
            protocol_followed=protocol,
            resolution_status="active"
        )
        
        # Store active emergency
        self.active_emergencies[emergency_id] = emergency_response
        
        return emergency_response
    
    def _notify_emergency_contacts(self, contacts: List[EmergencyContact], 
                                 emergency_type: EmergencyType,
                                 user_location: Optional[Tuple[float, float]]) -> List[str]:
        """Notify emergency contacts (simulation)"""
        notified = []
        
        # Sort contacts by priority
        sorted_contacts = sorted(contacts, key=lambda x: x.priority_order)
        
        for contact in sorted_contacts[:3]:  # Notify top 3 contacts
            # Simulate SMS/call notification
            message = self._generate_emergency_message(contact, emergency_type, user_location)
            
            # In real implementation, this would send actual SMS/make calls
            print(f"EMERGENCY NOTIFICATION to {contact.name} ({contact.phone_number}): {message}")
            notified.append(contact.name)
        
        return notified
    
    def _generate_emergency_message(self, contact: EmergencyContact, 
                                  emergency_type: EmergencyType,
                                  user_location: Optional[Tuple[float, float]]) -> str:
        """Generate emergency notification message"""
        
        if contact.preferred_language == 'swahili':
            base_message = f"DHARURA YA AFYA: Mgonjwa ana hali ya dharura ya {emergency_type.value}."
            if user_location:
                base_message += f" Mahali: {user_location[0]:.4f}, {user_location[1]:.4f}"
            base_message += " Piga simu 999 au nenda hospitali ya karibu."
        else:
            base_message = f"HEALTH EMERGENCY: Patient has {emergency_type.value} emergency."
            if user_location:
                base_message += f" Location: {user_location[0]:.4f}, {user_location[1]:.4f}"
            base_message += " Call 999 or go to nearest hospital."
        
        return base_message
    
    def get_emergency_protocol(self, emergency_type: EmergencyType) -> Optional[EmergencyProtocol]:
        """Get emergency protocol for specific emergency type"""
        return self.emergency_protocols.get(emergency_type)
    
    def get_emergency_numbers(self) -> Dict[str, str]:
        """Get all Kenyan emergency numbers"""
        return self.national_emergency_numbers
    
    def assess_emergency_severity(self, symptoms: Dict[str, any]) -> Tuple[EmergencyType, int]:
        """Assess emergency type and severity based on symptoms"""
        
        glucose_level = symptoms.get('glucose_level', 0)
        consciousness_level = symptoms.get('consciousness_level', 'alert')  # alert, confused, unconscious
        breathing_difficulty = symptoms.get('breathing_difficulty', False)
        chest_pain = symptoms.get('chest_pain', False)
        vomiting = symptoms.get('vomiting', False)
        
        # Determine emergency type and severity
        if glucose_level < 50 or consciousness_level == 'unconscious':
            return EmergencyType.SEVERE_HYPOGLYCEMIA, 9
        elif glucose_level > 400 and vomiting:
            return EmergencyType.DIABETIC_KETOACIDOSIS, 10
        elif glucose_level > 300:
            return EmergencyType.SEVERE_HYPERGLYCEMIA, 7
        elif chest_pain:
            return EmergencyType.CHEST_PAIN, 8
        elif breathing_difficulty:
            return EmergencyType.DIFFICULTY_BREATHING, 8
        else:
            return EmergencyType.GENERAL_EMERGENCY, 5
    
    def resolve_emergency(self, emergency_id: str, resolution_notes: str = "") -> bool:
        """Mark emergency as resolved"""
        if emergency_id in self.active_emergencies:
            self.active_emergencies[emergency_id].resolution_status = "resolved"
            return True
        return False
    
    def get_active_emergencies(self, user_id: str = None) -> List[EmergencyResponse]:
        """Get active emergencies for user or all"""
        active = [emergency for emergency in self.active_emergencies.values() 
                 if emergency.resolution_status == "active"]
        
        if user_id:
            active = [emergency for emergency in active if emergency.user_id == user_id]
        
        return active

# Global instance
kenyan_emergency_system = KenyanEmergencyResponseSystem()

def get_kenyan_emergency_system() -> KenyanEmergencyResponseSystem:
    """Get the global Kenyan emergency response system instance"""
    return kenyan_emergency_system
