import React, { useState, useEffect } from 'react';
import { useI18n } from "../contexts/LanguageContext";

const Education = () => {
  const { t } = useI18n();

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [language, setLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock education modules
  const mockModules = [
    {
      id: 'diabetes_basics',
      title_english: 'Understanding Diabetes',
      title_swahili: 'Kuelewa Kisukari',
      category: 'basics',
      difficulty: 'beginner',
      duration: '15 min',
      description_english: 'Learn the fundamentals of diabetes and how it affects your body',
      description_swahili: 'Jifunze misingi ya kisukari na jinsi inavyoathiri mwili wako',
      content: {
        english: [
          'Diabetes is a condition where your blood sugar levels are too high.',
          'There are two main types: Type 1 and Type 2 diabetes.',
          'Managing diabetes involves diet, exercise, and sometimes medication.',
          'Regular monitoring helps prevent complications.'
        ],
        swahili: [
          'Kisukari ni hali ambapo viwango vya sukari katika damu ni vya juu sana.',
          'Kuna aina mbili kuu: Kisukari cha aina ya 1 na cha aina ya 2.',
          'Kudhibiti kisukari kunahusisha lishe, mazoezi, na wakati mwingine dawa.',
          'Ufuatiliaji wa kawaida husaidia kuzuia matatizo.'
        ]
      },
      completed: true,
      progress: 100
    },
    {
      id: 'kenyan_foods_diabetes',
      title_english: 'Kenyan Foods for Diabetes',
      title_swahili: 'Vyakula vya Kenya kwa Kisukari',
      category: 'nutrition',
      difficulty: 'beginner',
      duration: '20 min',
      description_english: 'Discover how traditional Kenyan foods can help manage diabetes',
      description_swahili: 'Gundua jinsi vyakula vya kitamaduni vya Kenya vinavyoweza kusaidia kudhibiti kisukari',
      content: {
        english: [
          'Githeri is excellent for diabetes - high fiber, low glycemic index.',
          'Sukuma wiki provides essential nutrients with minimal carbs.',
          'Choose ugali in smaller portions and pair with vegetables.',
          'Traditional vegetables like terere and kunde are diabetes-friendly.'
        ],
        swahili: [
          'Githeri ni bora kwa kisukari - nyuzi nyingi, glycemic index ya chini.',
          'Sukuma wiki hutoa virutubisho muhimu na kabohaidreti kidogo.',
          'Chagua ugali kwa vipande vidogo na uchanganye na mboga.',
          'Mboga za kitamaduni kama terere na kunde ni rafiki wa kisukari.'
        ]
      },
      completed: false,
      progress: 60
    },
    {
      id: 'glucose_monitoring',
      title_english: 'Blood Glucose Monitoring',
      title_swahili: 'Kufuatilia Sukari ya Damu',
      category: 'monitoring',
      difficulty: 'intermediate',
      duration: '25 min',
      description_english: 'Learn when and how to monitor your blood glucose effectively',
      description_swahili: 'Jifunze wakati na jinsi ya kufuatilia sukari ya damu yako kwa ufanisi',
      content: {
        english: [
          'Check glucose before meals and 2 hours after eating.',
          'Target ranges: 80-130 mg/dL before meals, <180 mg/dL after meals.',
          'Keep a log to identify patterns and triggers.',
          'Share results with your healthcare provider regularly.'
        ],
        swahili: [
          'Angalia sukari kabla ya chakula na masaa 2 baada ya kula.',
          'Viwango vya lengo: 80-130 mg/dL kabla ya chakula, <180 mg/dL baada ya chakula.',
          'Weka rekodi ili kutambua mifumo na vichochezi.',
          'Shiriki matokeo na mtoa huduma za afya yako mara kwa mara.'
        ]
      },
      completed: false,
      progress: 0
    },
    {
      id: 'exercise_diabetes',
      title_english: 'Exercise and Diabetes',
      title_swahili: 'Mazoezi na Kisukari',
      category: 'lifestyle',
      difficulty: 'beginner',
      duration: '18 min',
      description_english: 'Safe and effective exercise strategies for diabetes management',
      description_swahili: 'Mikakati salama na ya ufanisi ya mazoezi kwa udhibiti wa kisukari',
      content: {
        english: [
          'Start with 10-15 minutes of walking after meals.',
          'Aim for 150 minutes of moderate exercise per week.',
          'Check glucose before and after exercise.',
          'Stay hydrated and carry glucose tablets if needed.'
        ],
        swahili: [
          'Anza na kutembea kwa dakika 10-15 baada ya chakula.',
          'Lenga dakika 150 za mazoezi ya wastani kwa wiki.',
          'Angalia sukari kabla na baada ya mazoezi.',
          'Kuwa na maji ya kutosha na ubebe vidonge vya glucose ikiwa itahitajika.'
        ]
      },
      completed: false,
      progress: 30
    },
    {
      id: 'stress_management',
      title_english: 'Stress and Blood Sugar',
      title_swahili: 'Msongo wa Mawazo na Sukari ya Damu',
      category: 'lifestyle',
      difficulty: 'intermediate',
      duration: '22 min',
      description_english: 'Understanding how stress affects glucose and management techniques',
      description_swahili: 'Kuelewa jinsi msongo wa mawazo unavyoathiri glucose na mbinu za udhibiti',
      content: {
        english: [
          'Stress hormones can raise blood glucose levels.',
          'Practice deep breathing and meditation techniques.',
          'Maintain regular sleep schedules.',
          'Seek support from family, friends, or counselors.'
        ],
        swahili: [
          'Homoni za msongo wa mawazo zinaweza kuongeza viwango vya glucose.',
          'Fanya mazoezi ya kupumua kwa kina na kutafakari.',
          'Dumisha ratiba za usingizi wa kawaida.',
          'Tafuta msaada kutoka kwa familia, marafiki, au washauri.'
        ]
      },
      completed: false,
      progress: 0
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setModules(mockModules);
      setUserProgress({
        totalModules: mockModules.length,
        completedModules: mockModules.filter(m => m.completed).length,
        totalProgress: Math.round(mockModules.reduce((sum, m) => sum + m.progress, 0) / mockModules.length)
      });
    }, 500);
  }, []);

  const categories = [
    { id: 'all', name: 'All Modules', name_swahili: 'Moduli Zote' },
    { id: 'basics', name: 'Basics', name_swahili: 'Misingi' },
    { id: 'nutrition', name: 'Nutrition', name_swahili: 'Lishe' },
    { id: 'monitoring', name: 'Monitoring', name_swahili: 'Ufuatiliaji' },
    { id: 'lifestyle', name: 'Lifestyle', name_swahili: 'Mtindo wa Maisha' }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#757575';
    }
  };

  const filteredModules = activeCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === activeCategory);

  const startModule = (module) => {
    setSelectedModule(module);
  };

  const completeModule = (moduleId) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, completed: true, progress: 100 }
        : module
    ));
    setSelectedModule(null);
    
    const updatedModules = modules.map(module => 
      module.id === moduleId 
        ? { ...module, completed: true, progress: 100 }
        : module
    );
    setUserProgress({
      totalModules: updatedModules.length,
      completedModules: updatedModules.filter(m => m.completed).length,
      totalProgress: Math.round(updatedModules.reduce((sum, m) => sum + m.progress, 0) / updatedModules.length)
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>{t("education_title") || "📚 Health Education"}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setLanguage('english')}
            style={{
              padding: '8px 16px',
              backgroundColor: language === 'english' ? '#2196F3' : 'transparent',
              color: language === 'english' ? 'white' : '#2196F3',
              border: '1px solid #2196F3',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('swahili')}
            style={{
              padding: '8px 16px',
              backgroundColor: language === 'swahili' ? '#2196F3' : 'transparent',
              color: language === 'swahili' ? 'white' : '#2196F3',
              border: '1px solid #2196F3',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Kiswahili
          </button>
        </div>
      </div>

      {!selectedModule ? (
        <>
          {/* Progress Overview */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px', 
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <h3>{t("learning_progress") || "Your Learning Progress"}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginTop: '15px' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>
                  {userProgress.totalProgress}%
                </div>
                <div>{t("overall_progress") || "Overall Progress"}</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
                  {userProgress.completedModules}
                </div>
                <div>{t("completed_modules") || "Completed Modules"}</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>
                  {userProgress.totalModules - userProgress.completedModules}
                </div>
                <div>{t("remaining") || "Remaining"}</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: activeCategory === category.id ? '#2196F3' : 'transparent',
                    color: activeCategory === category.id ? 'white' : '#2196F3',
                    border: '1px solid #2196F3',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  {language === 'swahili' ? category.name_swahili : category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredModules.map(module => (
              <div key={module.id} style={{
                padding: '20px',
                backgroundColor: 'white',
                border: module.completed ? '2px solid #4CAF50' : '1px solid #ddd',
                borderRadius: '8px',
                position: 'relative'
              }}>
                {module.completed && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    ✓ {t("completed") || "Completed"}
                  </div>
                )}

                <h3 style={{ marginBottom: '10px' }}>
                  {language === 'swahili' ? module.title_swahili : module.title_english}
                </h3>

                <p style={{ color: '#666', marginBottom: '15px' }}>
                  {language === 'swahili' ? module.description_swahili : module.description_english}
                </p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <span style={{
                    backgroundColor: getDifficultyColor(module.difficulty),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {module.difficulty}
                  </span>
                  <span style={{
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    ⏱️ {module.duration}
                  </span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px' }}>{t("progress") || "Progress"}</span>
                    <span style={{ fontSize: '14px' }}>{module.progress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#ddd',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${module.progress}%`,
                      height: '100%',
                      backgroundColor: module.completed ? '#4CAF50' : '#2196F3',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <button
                  onClick={() => startModule(module)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: module.completed ? '#4CAF50' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {module.completed 
                    ? t("review_module") || "Review Module" 
                    : module.progress > 0 
                      ? t("continue") || "Continue" 
                      : t("start_module") || "Start Module"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Module Content View */
        <div>
          <button
            onClick={() => setSelectedModule(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#2196F3',
              border: '1px solid #2196F3',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← {t("back_to_modules") || "Back to Modules"}
          </button>

          <div style={{
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h2 style={{ marginBottom: '20px' }}>
              {language === 'swahili' ? selectedModule.title_swahili : selectedModule.title_english}
            </h2>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                backgroundColor: getDifficultyColor(selectedModule.difficulty),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {selectedModule.difficulty}
              </span>
              <span style={{
                backgroundColor: '#e0e0e0',
                color: '#666',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                ⏱️ {selectedModule.duration}
              </span>
            </div>

            <div style={{ lineHeight: '1.8', fontSize: '16px' }}>
              {(language === 'swahili' ? selectedModule.content.swahili : selectedModule.content.english).map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '15px' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              {!selectedModule.completed && (
                <button
                  onClick={() => completeModule(selectedModule.id)}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {t("mark_complete") || "Mark as Complete"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extra static content from Nick’s version */}
      <div style={{ marginTop: '40px', padding: 16 }}>
        <h2>{t("education_title")}</h2>
        <ul>
          <li>Understanding Type 2 Diabetes</li>
          <li>Glycemic Index in Kenyan Foods</li>
          <li>Monitoring Blood Glucose</li>
          <li>Physical Activity Tips</li>
          <li>Hypoglycemia and Hyperglycemia Safety</li>
        </ul>
        <p>{t("more_interactive") || "More interactive modules can be added here."}</p>
      </div>
    </div>
  );
};

export default Education;
