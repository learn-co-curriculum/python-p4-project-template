// Swahili translations for the diabetes management app
export const translations = {
  en: {
    // Navigation
    home: 'Home',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    readings: 'Blood Sugar',
    medications: 'Medications',
    profile: 'Profile',
    logout: 'Logout',
    
    // Dashboard
    welcome: 'Welcome',
    bmi: 'BMI',
    educationalInsights: 'Educational Insights',
    personalizedAdvice: 'Personalized Advice',
    nutrition: 'Nutrition',
    exercise: 'Exercise',
    medication: 'Medication',
    bmiCategory: 'BMI Category',
    
    // Readings
    addReading: 'Add Blood Sugar Reading',
    value: 'Blood Sugar (mg/dL)',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',
    context: 'Context',
    preMeal: 'Before Meal',
    postMeal: 'After Meal',
    normal: 'normal',
    high: 'high',
    low: 'low',
    
    // Medications
    addMedication: 'Add Medication',
    name: 'Name',
    dose: 'Dose',
    status: 'Status',
    pending: 'pending',
    taken: 'taken',
    missed: 'missed',
    markTaken: 'Mark Taken',
    markMissed: 'Mark Missed',
    reset: 'Reset',
    quickActions: 'Quick Actions',
    markAllOverdue: 'Mark all overdue as missed',
    
    // Profile
    diabetesType: 'Diabetes Type',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    doctor: 'Doctor',
    unassigned: 'Unassigned',
    save: 'Save',
    saved: 'Saved!',
    
    // Common
    email: 'Email',
    password: 'Password',
    required: 'Required',
    optional: 'Optional',
    select: 'Select',
    
    // Local Foods
    ugali: 'Ugali',
    sukumaWiki: 'Sukuma Wiki',
    chapati: 'Chapati',
    githeri: 'Githeri',
    nyamaChoma: 'Nyama Choma',
    mandazi: 'Mandazi',
    
    // Diabetes Education
    type1Info: 'Type 1 diabetes: autoimmune condition requiring insulin therapy.',
    type2Info: 'Type 2 diabetes: insulin resistance; lifestyle and medication help.',
    gestationalInfo: 'Gestational diabetes: occurs during pregnancy; requires close monitoring.',
    prediabetesInfo: 'Prediabetes: elevated blood sugar; lifestyle changes are very effective.',
  },
  
  sw: {
    // Navigation
    home: 'Nyumbani',
    login: 'Ingia',
    signup: 'Jisajili',
    dashboard: 'Dashibodi',
    readings: 'Sukari ya Damu',
    medications: 'Dawa',
    profile: 'Wasifu',
    logout: 'Toka',
    
    // Dashboard
    welcome: 'Karibu',
    bmi: 'BMI',
    educationalInsights: 'Mafunzo ya Kisayansi',
    personalizedAdvice: 'Ushauri wa Kibinafsi',
    nutrition: 'Lishe',
    exercise: 'Mazoezi',
    medication: 'Dawa',
    bmiCategory: 'Kiwango cha BMI',
    
    // Readings
    addReading: 'Ongeza Kipimo cha Sukari ya Damu',
    value: 'Sukari ya Damu (mg/dL)',
    date: 'Tarehe',
    time: 'Muda',
    notes: 'Maelezo',
    context: 'Mazingira',
    preMeal: 'Kabla ya Chakula',
    postMeal: 'Baada ya Chakula',
    normal: 'kawaida',
    high: 'juu',
    low: 'chini',
    
    // Medications
    addMedication: 'Ongeza Dawa',
    name: 'Jina',
    dose: 'Kipimo',
    status: 'Hali',
    pending: 'inasubiri',
    taken: 'imetumika',
    missed: 'imepotea',
    markTaken: 'Weka Imetumika',
    markMissed: 'Weka Imepotea',
    reset: 'Rudisha',
    quickActions: 'Vitendo vya Haraka',
    markAllOverdue: 'Weka zote zilizochelewa kama zimepotea',
    
    // Profile
    diabetesType: 'Aina ya Kisukari',
    height: 'Urefu (cm)',
    weight: 'Uzito (kg)',
    doctor: 'Daktari',
    unassigned: 'Hajapangwa',
    save: 'Hifadhi',
    saved: 'Imehifadhiwa!',
    
    // Common
    email: 'Barua pepe',
    password: 'Nywila',
    required: 'Inahitajika',
    optional: 'Si lazima',
    select: 'Chagua',
    
    // Local Foods
    ugali: 'Ugali',
    sukumaWiki: 'Sukuma Wiki',
    chapati: 'Chapati',
    githeri: 'Githeri',
    nyamaChoma: 'Nyama Choma',
    mandazi: 'Mandazi',
    
    // Diabetes Education
    type1Info: 'Kisukari cha aina ya kwanza: hali ya kujikinga inayohitaji tiba ya insulini.',
    type2Info: 'Kisukari cha aina ya pili: upinzani wa insulini; mtindo wa maisha na dawa husaidia.',
    gestationalInfo: 'Kisukari cha ujauzito: hutokea wakati wa ujauzito; inahitaji ufuatiliaji wa karibu.',
    prediabetesInfo: 'Kabla ya kisukari: sukari ya damu iliyoongezeka; mabadiliko ya mtindo wa maisha ni madhubuti sana.',
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};
