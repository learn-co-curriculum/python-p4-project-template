/**
 * Comprehensive Swahili Translation System
 * Complete translations for all health-related terms and UI elements
 */

const swahiliTranslations = {
  // Medical Terms
  medical: {
    diabetes: 'Kisukari',
    blood_sugar: 'Sukari ya damu',
    blood_pressure: 'Shinikizo la damu',
    glucose: 'Glukosi',
    insulin: 'Insulini',
    medication: 'Dawa',
    symptoms: 'Dalili',
    treatment: 'Matibabu',
    diagnosis: 'Utambuzi',
    doctor: 'Daktari',
    nurse: 'Muuguzi',
    hospital: 'Hospitali',
    clinic: 'Kliniki',
    pharmacy: 'Duka la dawa',
    prescription: 'Maagizo ya dawa',
    dosage: 'Kipimo cha dawa',
    side_effects: 'Madhara ya dawa',
    allergies: 'Mzio',
    emergency: 'Dharura',
    first_aid: 'Huduma ya kwanza'
  },

  // Food and Nutrition
  nutrition: {
    nutrition: 'Lishe',
    nutrients: 'Virutubisho',
    calories: 'Kalori',
    carbohydrates: 'Kabohaidreti',
    proteins: 'Protini',
    fats: 'Mafuta',
    fiber: 'Nyuzi',
    vitamins: 'Vitamini',
    minerals: 'Madini',
    sodium: 'Sodiamu',
    calcium: 'Kalsiamu',
    iron: 'Chuma',
    glycemic_index: 'Kipimo cha glaisemiki'
  },

  // Traditional Kenyan Foods
  kenyan_foods: {
    ugali: 'Ugali',
    githeri: 'Githeri',
    sukuma_wiki: 'Sukuma Wiki',
    nyama_choma: 'Nyama Choma',
    chapati: 'Chapati',
    mandazi: 'Mandazi',
    mukimo: 'Mukimo',
    matoke: 'Matoke',
    mahindi: 'Mahindi',
    maharagwe: 'Maharagwe',
    kunde: 'Kunde',
    terere: 'Terere',
    managu: 'Managu',
    tilapia: 'Samaki wa tilapia',
    omena: 'Omena',
    millet: 'Mtama',
    cassava: 'Muhogo',
    sweet_potato: 'Viazi vitamu',
    arrow_roots: 'Nduma',
    pumpkin: 'Malenge',
    mango: 'Muembe',
    avocado: 'Parachichi',
    banana: 'Ndizi',
    coconut: 'Nazi',
    groundnuts: 'Karanga'
  },

  // Health Conditions
  conditions: {
    type_1_diabetes: 'Kisukari cha aina ya kwanza',
    type_2_diabetes: 'Kisukari cha aina ya pili',
    gestational_diabetes: 'Kisukari cha ujauzito',
    prediabetes: 'Kabla ya kisukari',
    hypoglycemia: 'Sukari ya chini',
    hyperglycemia: 'Sukari ya juu',
    hypertension: 'Shinikizo la juu la damu',
    heart_disease: 'Ugonjwa wa moyo',
    obesity: 'Unene kupita kiasi'
  },

  // Symptoms
  symptoms: {
    thirst: 'Kiu',
    frequent_urination: 'Kukojoa mara kwa mara',
    fatigue: 'Uchovu',
    blurred_vision: 'Kuona kwa ukungu',
    slow_healing: 'Uponyaji wa polepole',
    numbness: 'Kuganda',
    dizziness: 'Kizunguzungu',
    nausea: 'Kichefuchefu',
    headache: 'Maumivu ya kichwa',
    chest_pain: 'Maumivu ya kifua',
    weakness: 'Udhaifu',
    confusion: 'Kuchanganyikiwa',
    mood_swings: 'Mabadiliko ya hisia',
    stress: 'Msongo wa mawazo'
  },

  // Exercise and Physical Activity
  exercise: {
    exercise: 'Mazoezi',
    physical_activity: 'Shughuli za kimwili',
    walking: 'Kutembea',
    running: 'Kukimbia',
    swimming: 'Kuogelea',
    cycling: 'Kuendesha baiskeli',
    dancing: 'Kucheza',
    stretching: 'Kunyoosha',
    yoga: 'Yoga',
    aerobics: 'Aerobiki',
    strength_training: 'Mazoezi ya nguvu',
    cardio: 'Mazoezi ya moyo',
    warm_up: 'Joto la awali',
    cool_down: 'Kupumzika',
    fitness: 'Afya ya kimwili'
  },

  // Time and Frequency
  time: {
    daily: 'Kila siku',
    weekly: 'Kila wiki',
    monthly: 'Kila mwezi',
    morning: 'Asubuhi',
    afternoon: 'Mchana',
    evening: 'Jioni',
    night: 'Usiku',
    before_meals: 'Kabla ya chakula',
    after_meals: 'Baada ya chakula',
    with_meals: 'Pamoja na chakula',
    as_needed: 'Inapohitajika',
    regularly: 'Mara kwa mara',
    occasionally: 'Mara chache',
    always: 'Kila wakati',
    sometimes: 'Wakati mwingine',
    often: 'Mara nyingi',
    rarely: 'Nadra',
    immediately: 'Mara moja',
    gradually: 'Polepole'
  },

  // Common UI Elements
  ui: {
    login: 'Ingia',
    logout: 'Toka',
    register: 'Jisajili',
    submit: 'Wasilisha',
    cancel: 'Ghairi',
    save: 'Hifadhi',
    edit: 'Hariri',
    delete: 'Futa',
    add: 'Ongeza',
    remove: 'Ondoa',
    search: 'Tafuta',
    filter: 'Chuja',
    sort: 'Panga',
    view: 'Ona',
    download: 'Pakua',
    upload: 'Pakia',
    print: 'Chapisha',
    share: 'Shiriki',
    help: 'Msaada',
    settings: 'Mipangilio',
    profile: 'Wasifu',
    dashboard: 'Dashibodi',
    home: 'Nyumbani',
    back: 'Rudi',
    next: 'Ifuatayo',
    previous: 'Iliyotangulia',
    close: 'Funga',
    open: 'Fungua',
    loading: 'Inapakia...',
    error: 'Hitilafu',
    success: 'Mafanikio',
    warning: 'Onyo',
    info: 'Taarifa'
  },

  // Health Messages
  health_messages: {
    good_glucose: 'Viwango vya sukari ni mazuri',
    high_glucose: 'Sukari ya damu ni ya juu',
    low_glucose: 'Sukari ya damu ni ya chini',
    take_medication: 'Ni wakati wa kuchukua dawa',
    check_glucose: 'Pima sukari ya damu',
    exercise_reminder: 'Kumbuka kufanya mazoezi',
    drink_water: 'Nywa maji',
    eat_healthy: 'Kula chakula chenye afya',
    get_rest: 'Pata mapumziko ya kutosha',
    see_doctor: 'Ona daktari',
    emergency_help: 'Tafuta msaada wa dharura',
    medication_reminder: 'Ukumbusho wa dawa',
    appointment_reminder: 'Ukumbusho wa miadi'
  },

  // Food Preparation
  cooking: {
    cooking: 'Kupikia',
    boiling: 'Kuchemsha',
    steaming: 'Kupika kwa mvuke',
    frying: 'Kukaanga',
    grilling: 'Kuchoma',
    roasting: 'Kuoka',
    baking: 'Kuoka oveni',
    mixing: 'Kuchanganya',
    stirring: 'Kukoroga',
    chopping: 'Kukata vipande vipande',
    slicing: 'Kukata vipande',
    washing: 'Kuosha',
    soaking: 'Kulowa',
    seasoning: 'Kuongeza viungo'
  },

  // Gamification Terms
  gamification: {
    points: 'Pointi',
    level: 'Kiwango',
    badge: 'Bej',
    achievement: 'Mafanikio',
    challenge: 'Changamoto',
    reward: 'Zawadi',
    leaderboard: 'Ubao wa viongozi',
    streak: 'Mfululizo',
    progress: 'Maendeleo',
    goal: 'Lengo',
    target: 'Shabaha',
    completed: 'Imekamilika',
    pending: 'Inasubiri',
    failed: 'Imeshindwa',
    winner: 'Mshindi',
    participant: 'Mshiriki',
    competition: 'Ushindani',
    ranking: 'Upangaji',
    score: 'Alama'
  },

  // Educational Terms
  education: {
    learn: 'Jifunze',
    lesson: 'Somo',
    module: 'Moduli',
    course: 'Kozi',
    tutorial: 'Mafunzo',
    guide: 'Mwongozo',
    tip: 'Kidokezo',
    advice: 'Ushauri',
    information: 'Taarifa',
    knowledge: 'Ujuzi',
    skill: 'Ustadi',
    practice: 'Mazoezi',
    example: 'Mfano',
    demonstration: 'Onyesho',
    explanation: 'Maelezo',
    instruction: 'Maagizo',
    step: 'Hatua',
    procedure: 'Utaratibu',
    method: 'Njia',
    technique: 'Mbinu'
  }
};

// Helper functions for translation
export const translateToSwahili = (category, key) => {
  if (swahiliTranslations[category] && swahiliTranslations[category][key]) {
    return swahiliTranslations[category][key];
  }
  return key; // Return original key if translation not found
};

export const getSwahiliTranslation = (path) => {
  const keys = path.split('.');
  let translation = swahiliTranslations;
  
  for (const key of keys) {
    if (translation && translation[key]) {
      translation = translation[key];
    } else {
      return path; // Return original path if translation not found
    }
  }
  
  return translation;
};

export const getAllSwahiliTerms = (category) => {
  return swahiliTranslations[category] || {};
};

export const searchSwahiliTranslations = (searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();
  
  Object.keys(swahiliTranslations).forEach(category => {
    Object.keys(swahiliTranslations[category]).forEach(key => {
      const translation = swahiliTranslations[category][key];
      if (key.toLowerCase().includes(term) || 
          translation.toLowerCase().includes(term)) {
        results.push({
          category,
          english: key,
          swahili: translation
        });
      }
    });
  });
  
  return results;
};

// Common health phrases in Swahili
export const healthPhrases = {
  greetings: {
    'How are you?': 'Hujambo?',
    'I am fine': 'Niko sawa',
    'How is your health?': 'Afya yako iko vipi?',
    'I feel good': 'Nahisi vizuri',
    'I feel sick': 'Nahisi mgonjwa',
    'I need help': 'Ninahitaji msaada'
  },
  
  medical_questions: {
    'Where does it hurt?': 'Unaumwa wapi?',
    'When did it start?': 'Ilianza lini?',
    'How long have you felt this way?': 'Umehisi hivi kwa muda gani?',
    'Have you taken any medication?': 'Umechukua dawa yoyote?',
    'Do you have allergies?': 'Una mzio?',
    'Are you diabetic?': 'Una kisukari?'
  },
  
  instructions: {
    'Take this medication': 'Chukua dawa hii',
    'Come back in a week': 'Rudi baada ya wiki',
    'Drink plenty of water': 'Nywa maji mengi',
    'Get enough rest': 'Pata mapumziko ya kutosha',
    'Exercise regularly': 'Fanya mazoezi mara kwa mara',
    'Eat healthy food': 'Kula chakula chenye afya'
  },
  
  emergencies: {
    'Call for help': 'Piga simu utafute msaada',
    'Go to hospital': 'Nenda hospitalini',
    'This is urgent': 'Hii ni ya haraka',
    'I need a doctor': 'Ninahitaji daktari',
    'Call an ambulance': 'Piga simu gari la wagonjwa',
    'Emergency': 'Dharura'
  }
};

// Regional variations (different Kenyan regions may have slight variations)
export const regionalVariations = {
  coast: {
    'water': 'maji', // Standard
    'food': 'chakula', // Standard
    'medicine': 'dawa' // Standard
  },
  
  central: {
    'porridge': 'uji',
    'vegetables': 'mboga',
    'meat': 'nyama'
  },
  
  western: {
    'milk': 'maziwa',
    'eggs': 'mayai',
    'chicken': 'kuku'
  }
};

export default swahiliTranslations;
