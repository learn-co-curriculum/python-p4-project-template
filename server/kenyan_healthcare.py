"""
Kenyan Healthcare Integration - Healthcare facilities, NHIF integration, and local health services
Provides access to Kenyan healthcare system information and services
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import json

class FacilityType(Enum):
    NATIONAL_HOSPITAL = "national_hospital"
    COUNTY_HOSPITAL = "county_hospital"
    SUB_COUNTY_HOSPITAL = "sub_county_hospital"
    HEALTH_CENTER = "health_center"
    DISPENSARY = "dispensary"
    PRIVATE_HOSPITAL = "private_hospital"
    CLINIC = "clinic"
    PHARMACY = "pharmacy"
    LABORATORY = "laboratory"

class ServiceType(Enum):
    DIABETES_CARE = "diabetes_care"
    ENDOCRINOLOGY = "endocrinology"
    NUTRITION_COUNSELING = "nutrition_counseling"
    LABORATORY_SERVICES = "laboratory_services"
    PHARMACY_SERVICES = "pharmacy_services"
    EMERGENCY_SERVICES = "emergency_services"
    OUTPATIENT = "outpatient"
    INPATIENT = "inpatient"
    SPECIALIZED_CLINIC = "specialized_clinic"

@dataclass
class HealthFacility:
    id: str
    name: str
    facility_type: FacilityType
    county: str
    sub_county: str
    location: str
    coordinates: Tuple[float, float]  # (latitude, longitude)
    contact_phone: str
    contact_email: Optional[str]
    services: List[ServiceType]
    nhif_accredited: bool
    operating_hours: Dict[str, str]
    diabetes_services: Dict[str, any]
    emergency_contact: str
    languages_supported: List[str]
    accessibility_features: List[str]

@dataclass
class NHIFService:
    service_code: str
    service_name: str
    service_name_swahili: str
    category: str
    covered_amount: float
    patient_copay: float
    requirements: List[str]
    diabetes_related: bool

@dataclass
class EmergencyContact:
    service_name: str
    service_name_swahili: str
    phone_number: str
    description: str
    availability: str
    coverage_area: str

class KenyanHealthcareSystem:
    """Comprehensive Kenyan healthcare system integration"""
    
    def __init__(self):
        self.health_facilities = self._initialize_facilities()
        self.nhif_services = self._initialize_nhif_services()
        self.emergency_contacts = self._initialize_emergency_contacts()
        self.facility_index = {facility.id: facility for facility in self.health_facilities}
    
    def _initialize_facilities(self) -> List[HealthFacility]:
        """Initialize database with major Kenyan health facilities"""
        return [
            # NAIROBI FACILITIES
            HealthFacility(
                id="knh_nairobi",
                name="Kenyatta National Hospital",
                facility_type=FacilityType.NATIONAL_HOSPITAL,
                county="Nairobi",
                sub_county="Dagoretti North",
                location="Upper Hill, Nairobi",
                coordinates=(-1.3013, 36.8073),
                contact_phone="+254 20 2726300",
                contact_email="info@knh.or.ke",
                services=[
                    ServiceType.DIABETES_CARE,
                    ServiceType.ENDOCRINOLOGY,
                    ServiceType.NUTRITION_COUNSELING,
                    ServiceType.LABORATORY_SERVICES,
                    ServiceType.EMERGENCY_SERVICES,
                    ServiceType.INPATIENT,
                    ServiceType.OUTPATIENT
                ],
                nhif_accredited=True,
                operating_hours={
                    "monday": "24 hours",
                    "tuesday": "24 hours",
                    "wednesday": "24 hours",
                    "thursday": "24 hours",
                    "friday": "24 hours",
                    "saturday": "24 hours",
                    "sunday": "24 hours"
                },
                diabetes_services={
                    "diabetes_clinic": "Monday, Wednesday, Friday 8:00 AM - 4:00 PM",
                    "endocrinology_clinic": "Tuesday, Thursday 9:00 AM - 3:00 PM",
                    "nutrition_counseling": "Daily 8:00 AM - 5:00 PM",
                    "diabetes_education": "Every Saturday 10:00 AM - 12:00 PM",
                    "foot_care_clinic": "Wednesday 2:00 PM - 4:00 PM"
                },
                emergency_contact="+254 20 2726300",
                languages_supported=["English", "Swahili", "Kikuyu"],
                accessibility_features=["Wheelchair accessible", "Sign language interpreter", "Braille materials"]
            ),
            
            HealthFacility(
                id="nairobi_hospital",
                name="The Nairobi Hospital",
                facility_type=FacilityType.PRIVATE_HOSPITAL,
                county="Nairobi",
                sub_county="Westlands",
                location="Argwings Kodhek Road, Nairobi",
                coordinates=(-1.2921, 36.7872),
                contact_phone="+254 20 2845000",
                contact_email="info@nairobihospital.org",
                services=[
                    ServiceType.DIABETES_CARE,
                    ServiceType.ENDOCRINOLOGY,
                    ServiceType.NUTRITION_COUNSELING,
                    ServiceType.LABORATORY_SERVICES,
                    ServiceType.PHARMACY_SERVICES
                ],
                shif_accredited=True,
                operating_hours={
                    "monday": "24 hours",
                    "tuesday": "24 hours", 
                    "wednesday": "24 hours",
                    "thursday": "24 hours",
                    "friday": "24 hours",
                    "saturday": "24 hours",
                    "sunday": "24 hours"
                },
                diabetes_services={
                    "diabetes_clinic": "Daily 8:00 AM - 6:00 PM",
                    "endocrinology_clinic": "Monday to Friday 9:00 AM - 5:00 PM",
                    "nutrition_counseling": "Daily 8:00 AM - 6:00 PM",
                    "diabetes_education": "Tuesday, Thursday 2:00 PM - 4:00 PM"
                },
                emergency_contact="+254 20 2845000",
                languages_supported=["English", "Swahili"],
                accessibility_features=["Wheelchair accessible", "Parking available", "Modern equipment"]
            ),
            
            # MOMBASA FACILITIES
            HealthFacility(
                id="coast_general_hospital",
                name="Coast General Hospital",
                facility_type=FacilityType.COUNTY_HOSPITAL,
                county="Mombasa",
                sub_county="Mvita",
                location="Mombasa",
                coordinates=(-4.0435, 39.6682),
                contact_phone="+254 41 2312191",
                contact_email="info@coastgeneral.go.ke",
                services=[
                    ServiceType.DIABETES_CARE,
                    ServiceType.NUTRITION_COUNSELING,
                    ServiceType.LABORATORY_SERVICES,
                    ServiceType.EMERGENCY_SERVICES,
                    ServiceType.OUTPATIENT
                ],
                shif_accredited=True,
                operating_hours={
                    "monday": "24 hours",
                    "tuesday": "24 hours",
                    "wednesday": "24 hours", 
                    "thursday": "24 hours",
                    "friday": "24 hours",
                    "saturday": "24 hours",
                    "sunday": "Emergency only"
                },
                diabetes_services={
                    "diabetes_clinic": "Monday, Wednesday, Friday 8:00 AM - 3:00 PM",
                    "nutrition_counseling": "Tuesday, Thursday 9:00 AM - 4:00 PM",
                    "diabetes_education": "First Saturday of month 9:00 AM - 11:00 AM"
                },
                emergency_contact="+254 41 2312191",
                languages_supported=["English", "Swahili", "Arabic"],
                accessibility_features=["Basic wheelchair access", "Community outreach programs"]
            ),
            
            # KISUMU FACILITIES
            HealthFacility(
                id="jaramogi_hospital",
                name="Jaramogi Oginga Odinga Teaching and Referral Hospital",
                facility_type=FacilityType.NATIONAL_HOSPITAL,
                county="Kisumu",
                sub_county="Kisumu Central",
                location="Kisumu",
                coordinates=(-0.0917, 34.7680),
                contact_phone="+254 57 2025555",
                contact_email="info@jootrh.go.ke",
                services=[
                    ServiceType.DIABETES_CARE,
                    ServiceType.ENDOCRINOLOGY,
                    ServiceType.NUTRITION_COUNSELING,
                    ServiceType.LABORATORY_SERVICES,
                    ServiceType.EMERGENCY_SERVICES
                ],
                shif_accredited=True,
                operating_hours={
                    "monday": "24 hours",
                    "tuesday": "24 hours",
                    "wednesday": "24 hours",
                    "thursday": "24 hours", 
                    "friday": "24 hours",
                    "saturday": "24 hours",
                    "sunday": "Emergency only"
                },
                diabetes_services={
                    "diabetes_clinic": "Tuesday, Thursday 8:00 AM - 4:00 PM",
                    "nutrition_counseling": "Monday, Wednesday, Friday 9:00 AM - 3:00 PM",
                    "diabetes_education": "Every other Saturday 10:00 AM - 12:00 PM"
                },
                emergency_contact="+254 57 2025555",
                languages_supported=["English", "Swahili", "Luo"],
                accessibility_features=["Wheelchair accessible", "Community health programs"]
            ),
            
            # NAKURU FACILITIES
            HealthFacility(
                id="nakuru_level5_hospital",
                name="Nakuru Level 5 Hospital",
                facility_type=FacilityType.COUNTY_HOSPITAL,
                county="Nakuru",
                sub_county="Nakuru Town East",
                location="Nakuru",
                coordinates=(-0.3031, 36.0800),
                contact_phone="+254 51 2213349",
                contact_email="info@nakuruhospital.go.ke",
                services=[
                    ServiceType.DIABETES_CARE,
                    ServiceType.NUTRITION_COUNSELING,
                    ServiceType.LABORATORY_SERVICES,
                    ServiceType.OUTPATIENT,
                    ServiceType.EMERGENCY_SERVICES
                ],
                shif_accredited=True,
                operating_hours={
                    "monday": "7:00 AM - 5:00 PM",
                    "tuesday": "7:00 AM - 5:00 PM",
                    "wednesday": "7:00 AM - 5:00 PM",
                    "thursday": "7:00 AM - 5:00 PM",
                    "friday": "7:00 AM - 5:00 PM",
                    "saturday": "8:00 AM - 1:00 PM",
                    "sunday": "Emergency only"
                },
                diabetes_services={
                    "diabetes_clinic": "Monday, Wednesday 8:00 AM - 3:00 PM",
                    "nutrition_counseling": "Tuesday, Thursday 9:00 AM - 2:00 PM"
                },
                emergency_contact="+254 51 2213349",
                languages_supported=["English", "Swahili", "Kikuyu"],
                accessibility_features=["Basic facilities", "Community outreach"]
            )
        ]
    
    def _initialize_nhif_services(self) -> List[NHIFService]:
        """Initialize NHIF covered services for diabetes care"""
        return [
            SHIFService(
                service_code="DIAB001",
                service_name="Diabetes Consultation",
                service_name_swahili="Ushauri wa Kisukari",
                category="Outpatient",
                covered_amount=1500.0,
                patient_copay=0.0,
                requirements=["Valid NHIF card", "Referral letter (if required)"],
                diabetes_related=True
            ),
            
            SHIFService(
                service_code="LAB001",
                service_name="Blood Glucose Test",
                service_name_swahili="Upimaji wa Sukari ya Damu",
                category="Laboratory",
                covered_amount=300.0,
                patient_copay=0.0,
                requirements=["Valid NHIF card", "Doctor's request"],
                diabetes_related=True
            ),
            
            SHIFService(
                service_code="LAB002", 
                service_name="HbA1c Test",
                service_name_swahili="Upimaji wa HbA1c",
                category="Laboratory",
                covered_amount=2500.0,
                patient_copay=500.0,
                requirements=["Valid NHIF card", "Specialist referral"],
                diabetes_related=True
            ),
            
            SHIFService(
                service_code="NUTR001",
                service_name="Nutrition Counseling",
                service_name_swahili="Ushauri wa Lishe",
                category="Specialized Services",
                covered_amount=1000.0,
                patient_copay=200.0,
                requirements=["Valid NHIF card", "Doctor's referral"],
                diabetes_related=True
            ),
            
            SHIFService(
                service_code="PHARM001",
                service_name="Diabetes Medications",
                service_name_swahili="Dawa za Kisukari",
                category="Pharmacy",
                covered_amount=3000.0,
                patient_copay=300.0,
                requirements=["Valid NHIF card", "Valid prescription"],
                diabetes_related=True
            ),
            
            SHIFService(
                service_code="FOOT001",
                service_name="Diabetic Foot Care",
                service_name_swahili="Utunzaji wa Miguu ya Kisukari",
                category="Specialized Services",
                covered_amount=2000.0,
                patient_copay=400.0,
                requirements=["Valid NHIF card", "Specialist referral"],
                diabetes_related=True
            )
        ]
    
    def _initialize_emergency_contacts(self) -> List[EmergencyContact]:
        """Initialize emergency contacts for health services"""
        return [
            EmergencyContact(
                service_name="National Emergency Services",
                service_name_swahili="Huduma za Dharura za Kitaifa",
                phone_number="999",
                description="National emergency number for medical emergencies",
                availability="24/7",
                coverage_area="Nationwide"
            ),
            
            EmergencyContact(
                service_name="Kenya Red Cross Emergency",
                service_name_swahili="Dharura ya Msalaba Mwekundu Kenya",
                phone_number="1199",
                description="Kenya Red Cross emergency response",
                availability="24/7", 
                coverage_area="Nationwide"
            ),
            
            EmergencyContact(
                service_name="Diabetes Emergency Helpline",
                service_name_swahili="Simu ya Msaada wa Dharura ya Kisukari",
                phone_number="0800 724 000",
                description="24-hour diabetes emergency support and advice",
                availability="24/7",
                coverage_area="Nationwide"
            ),
            
            EmergencyContact(
                service_name="NHIF Customer Care",
                service_name_swahili="Huduma kwa Wateja wa NHIF",
                phone_number="0800 720 601",
                description="NHIF services and claims support",
                availability="Monday-Friday 8AM-5PM",
                coverage_area="Nationwide"
            ),
            
            EmergencyContact(
                service_name="Ministry of Health Hotline",
                service_name_swahili="Simu ya Moto ya Wizara ya Afya",
                phone_number="0729 471 414",
                description="Ministry of Health information and support",
                availability="24/7",
                coverage_area="Nationwide"
            )
        ]
    
    def find_facilities_by_location(self, county: str, service_type: ServiceType = None) -> List[HealthFacility]:
        """Find health facilities by county and optional service type"""
        facilities = [f for f in self.health_facilities if f.county.lower() == county.lower()]
        
        if service_type:
            facilities = [f for f in facilities if service_type in f.services]
        
        return facilities
    
    def find_diabetes_facilities(self, county: str = None) -> List[HealthFacility]:
        """Find facilities that offer diabetes care"""
        facilities = [f for f in self.health_facilities if ServiceType.DIABETES_CARE in f.services]
        
        if county:
            facilities = [f for f in facilities if f.county.lower() == county.lower()]
        
        return facilities
    
    def find_nhif_accredited_facilities(self, county: str = None) -> List[HealthFacility]:
        """Find SHIF accredited facilities"""
        facilities = [f for f in self.health_facilities if f.nhif_accredited]
        
        if county:
            facilities = [f for f in facilities if f.county.lower() == county.lower()]
        
        return facilities
    
    def get_shif_diabetes_services(self) -> List[NHIFService]:
        """Get SHIF covered diabetes-related services"""
        return [service for service in self.nhif_services if service.diabetes_related]
    
    def calculate_nhif_coverage(self, service_codes: List[str]) -> Dict[str, float]:
        """Calculate SHIF coverage for given services"""
        total_covered = 0.0
        total_copay = 0.0
        
        for code in service_codes:
            service = next((s for s in self.nhif_services if s.service_code == code), None)
            if service:
                total_covered += service.covered_amount
                total_copay += service.patient_copay
        
        return {
            "total_service_cost": total_covered + total_copay,
            "nhif_covered": total_covered,
            "patient_copay": total_copay,
            "coverage_percentage": (total_covered / (total_covered + total_copay)) * 100 if (total_covered + total_copay) > 0 else 0
        }
    
    def get_facility_by_id(self, facility_id: str) -> Optional[HealthFacility]:
        """Get facility by ID"""
        return self.facility_index.get(facility_id)
    
    def get_emergency_contacts(self) -> List[EmergencyContact]:
        """Get all emergency contacts"""
        return self.emergency_contacts
    
    def find_nearest_facilities(self, latitude: float, longitude: float, max_distance_km: float = 50) -> List[Tuple[HealthFacility, float]]:
        """Find facilities within specified distance (simplified distance calculation)"""
        import math
        
        facilities_with_distance = []
        
        for facility in self.health_facilities:
            # Simple distance calculation (not perfectly accurate but good enough for demo)
            lat_diff = abs(facility.coordinates[0] - latitude)
            lon_diff = abs(facility.coordinates[1] - longitude)
            distance = math.sqrt(lat_diff**2 + lon_diff**2) * 111  # Rough km conversion
            
            if distance <= max_distance_km:
                facilities_with_distance.append((facility, distance))
        
        # Sort by distance
        facilities_with_distance.sort(key=lambda x: x[1])
        return facilities_with_distance
    
    def get_facility_operating_status(self, facility_id: str, day_of_week: str, current_time: str) -> Dict[str, any]:
        """Check if facility is currently open"""
        facility = self.get_facility_by_id(facility_id)
        if not facility:
            return {"error": "Facility not found"}
        
        operating_hours = facility.operating_hours.get(day_of_week.lower(), "Closed")
        
        is_open = False
        if operating_hours == "24 hours":
            is_open = True
        elif operating_hours != "Closed" and operating_hours != "Emergency only":
            # Simple time check (would need more sophisticated parsing in real implementation)
            is_open = True  # Simplified for demo
        
        return {
            "facility_name": facility.name,
            "is_open": is_open,
            "operating_hours": operating_hours,
            "emergency_contact": facility.emergency_contact,
            "services_available": [service.value for service in facility.services]
        }

# Global instance
kenyan_healthcare = KenyanHealthcareSystem()

def get_kenyan_healthcare_system() -> KenyanHealthcareSystem:
    """Get the global Kenyan healthcare system instance"""
    return kenyan_healthcare
