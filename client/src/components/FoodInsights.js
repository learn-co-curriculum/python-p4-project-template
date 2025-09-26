import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export default function FoodInsights() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [foods, setFoods] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [language]);

  async function loadData() {
    setLoading(true);
    try {
      // Load food database
      const foodsRes = await fetch('/kenyan-foods');
      if (foodsRes.ok) {
        const foodsData = await foodsRes.json();
        setFoods(foodsData.foods || {});
      }

      // Load personalized recommendations
      const recRes = await fetch(`/food-recommendations?lang=${language}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecommendations(recData);
      }
    } catch (e) {
      console.error('Failed to load food data:', e);
    } finally {
      setLoading(false);
    }
  }

  const getGlucoseImpactColor = (impact) => {
    switch (impact) {
      case 'none': return '#34d399'; // green
      case 'low': return '#34d399';
      case 'medium': return '#fbbf24'; // yellow
      case 'high': return '#f87171'; // red
      case 'very_high': return '#dc2626'; // dark red
      default: return '#9ca3af'; // gray
    }
  };

  const getGlucoseImpactText = (impact) => {
    const impacts = {
      none: { en: 'No Impact', sw: 'Hakuna Athari' },
      low: { en: 'Low Impact', sw: 'Athari Ndogo' },
      medium: { en: 'Medium Impact', sw: 'Athari ya Kati' },
      high: { en: 'High Impact', sw: 'Athari Kubwa' },
      very_high: { en: 'Very High Impact', sw: 'Athari Kubwa Sana' }
    };
    return impacts[impact]?.[language] || impact;
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Loading food insights...</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>{t('home')}</span>
          <span className="sep">›</span>
          <b>Food Insights</b>
        </div>
        <div className="accent-line" />
      </div>

      {/* Personalized Recommendations */}
      {recommendations && (
        <div className="card section">
          <h3 style={{ marginTop: 0 }}>
            {language === 'sw' ? 'Mapendekezo ya Kibinafsi' : 'Personalized Food Recommendations'}
          </h3>
          <p>
            <strong>{language === 'sw' ? 'Aina ya Kisukari' : 'Diabetes Type'}:</strong> {recommendations.diabetes_type}
          </p>
          <ul>
            {recommendations.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Food Categories */}
      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        {/* Diabetes-Friendly Foods */}
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#34d399' }}>
            {language === 'sw' ? 'Vyakula Rafiki kwa Kisukari' : 'Diabetes-Friendly Foods'}
          </h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {recommendations?.diabetes_friendly?.map(foodKey => {
              const food = foods[foodKey];
              if (!food) return null;
              return (
                <button
                  key={foodKey}
                  className="btn btn-outline"
                  onClick={() => setSelectedFood(food)}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  {food[`name_${language}`] || food.name_en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Foods to Limit */}
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#f87171' }}>
            {language === 'sw' ? 'Vyakula vya Kujizuia' : 'Foods to Limit'}
          </h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {recommendations?.foods_to_limit?.map(foodKey => {
              const food = foods[foodKey];
              if (!food) return null;
              return (
                <button
                  key={foodKey}
                  className="btn btn-outline"
                  onClick={() => setSelectedFood(food)}
                  style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  {food[`name_${language}`] || food.name_en}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* All Foods Grid */}
      <div className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Vyakula vya Kikenya' : 'Kenyan Foods Database'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {Object.entries(foods).map(([key, food]) => (
            <div
              key={key}
              className="list-item"
              style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${getGlucoseImpactColor(food.glucose_impact)}`
              }}
              onClick={() => setSelectedFood(food)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{food[`name_${language}`] || food.name_en}</strong>
                <span
                  className="badge"
                  style={{
                    backgroundColor: getGlucoseImpactColor(food.glucose_impact),
                    color: food.glucose_impact === 'none' || food.glucose_impact === 'low' ? '#000' : '#fff',
                    fontSize: '0.7rem'
                  }}
                >
                  {getGlucoseImpactText(food.glucose_impact)}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                {food.calories} cal | {food.carbs}g carbs | GI: {food.glycemic_index}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={() => setSelectedFood(null)}
        >
          <div
            className="card"
            style={{ maxWidth: 500, maxHeight: '80vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>
                {selectedFood[`name_${language}`] || selectedFood.name_en}
              </h3>
              <button
                onClick={() => setSelectedFood(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text)' }}
              >
                ×
              </button>
            </div>

            {/* Nutritional Info */}
            <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
              <div><strong>{language === 'sw' ? 'Kalori' : 'Calories'}:</strong> {selectedFood.calories}</div>
              <div><strong>{language === 'sw' ? 'Kabohaidreti' : 'Carbs'}:</strong> {selectedFood.carbs}g</div>
              <div><strong>{language === 'sw' ? 'Nyuzi' : 'Fiber'}:</strong> {selectedFood.fiber}g</div>
              <div><strong>{language === 'sw' ? 'Protini' : 'Protein'}:</strong> {selectedFood.protein}g</div>
              <div><strong>{language === 'sw' ? 'Mafuta' : 'Fat'}:</strong> {selectedFood.fat}g</div>
              <div><strong>GI:</strong> {selectedFood.glycemic_index}</div>
            </div>

            {/* Glucose Impact */}
            <div style={{ marginBottom: 16 }}>
              <strong>{language === 'sw' ? 'Athari ya Sukari ya Damu' : 'Blood Sugar Impact'}:</strong>
              <span
                style={{
                  marginLeft: 8,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: getGlucoseImpactColor(selectedFood.glucose_impact),
                  color: selectedFood.glucose_impact === 'none' || selectedFood.glucose_impact === 'low' ? '#000' : '#fff',
                  fontSize: '0.8rem'
                }}
              >
                {getGlucoseImpactText(selectedFood.glucose_impact)}
              </span>
            </div>

            {/* Diabetes Tips */}
            <div>
              <h4>{language === 'sw' ? 'Vidokezo vya Kisukari' : 'Diabetes Tips'}</h4>
              <ul>
                {selectedFood.diabetes_tips[language]?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                )) || selectedFood.diabetes_tips.en?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
