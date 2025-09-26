import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export default function SmartAlerts() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState('');
  const [foodPrediction, setFoodPrediction] = useState(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/glucose-alerts?lang=${language}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
        setPatterns(data.patterns_summary);
      }
    } catch (e) {
      console.error('Failed to load alerts:', e);
    } finally {
      setLoading(false);
    }
  }, [language, token]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  async function predictFoodImpact() {
    if (!selectedFood) return;
    
    try {
      const res = await fetch('/food-impact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          food_name: selectedFood,
          language: language
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFoodPrediction(data.prediction);
      }
    } catch (e) {
      console.error('Failed to predict food impact:', e);
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📊';
    }
  };

  const kenyanFoods = [
    'ugali', 'sukuma_wiki', 'chapati', 'githeri', 
    'nyama_choma', 'mandazi', 'sweet_potato', 'terere'
  ];

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Inapakia Tahadhari za Akili...' : 'Loading Smart Alerts...'}
        </h2>
      </div>
    );
  }

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>{t('home')}</span>
          <span className="sep">›</span>
          <b>{language === 'sw' ? 'Tahadhari za Akili' : 'Smart Alerts'}</b>
        </div>
        <div className="accent-line" />
      </div>

      {/* Patterns Summary */}
      {patterns && (
        <div className="card section">
          <h3 style={{ marginTop: 0 }}>
            {language === 'sw' ? 'Muhtasari wa Mifumo' : 'Patterns Summary'}
          </h3>
          <div className="grid-2" style={{ gap: 16 }}>
            <div>
              <strong>{language === 'sw' ? 'Jumla ya Vipimo' : 'Total Readings'}:</strong> {patterns.total_readings}
            </div>
            <div>
              <strong>{language === 'sw' ? 'Vipimo vya Juu' : 'High Readings'}:</strong> 
              <span style={{ color: patterns.high_readings > 0 ? '#dc2626' : '#10b981', marginLeft: 8 }}>
                {patterns.high_readings}
              </span>
            </div>
            <div>
              <strong>{language === 'sw' ? 'Vipimo vya Chini' : 'Low Readings'}:</strong>
              <span style={{ color: patterns.low_readings > 0 ? '#f59e0b' : '#10b981', marginLeft: 8 }}>
                {patterns.low_readings}
              </span>
            </div>
            <div>
              <strong>{language === 'sw' ? 'Mwelekeo wa Hivi Karibuni' : 'Recent Trend'}:</strong>
              <span style={{ 
                color: patterns.recent_trend === 'rising' ? '#dc2626' : 
                       patterns.recent_trend === 'falling' ? '#f59e0b' : '#10b981',
                marginLeft: 8
              }}>
                {patterns.recent_trend === 'rising' ? (language === 'sw' ? 'Kuongezeka' : 'Rising') :
                 patterns.recent_trend === 'falling' ? (language === 'sw' ? 'Kushuka' : 'Falling') :
                 (language === 'sw' ? 'Imara' : 'Stable')}
              </span>
            </div>
          </div>
          
          {patterns.avg_pre_meal && (
            <div style={{ marginTop: 12 }}>
              <strong>{language === 'sw' ? 'Wastani Kabla ya Chakula' : 'Average Pre-meal'}:</strong> {patterns.avg_pre_meal.toFixed(1)} mg/dL
            </div>
          )}
          {patterns.avg_post_meal && (
            <div style={{ marginTop: 8 }}>
              <strong>{language === 'sw' ? 'Wastani Baada ya Chakula' : 'Average Post-meal'}:</strong> {patterns.avg_post_meal.toFixed(1)} mg/dL
            </div>
          )}
        </div>
      )}

      {/* Food Impact Predictor */}
      <div className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Utabiri wa Athari ya Chakula' : 'Food Impact Predictor'}
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={selectedFood} 
            onChange={(e) => setSelectedFood(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          >
            <option value="">
              {language === 'sw' ? 'Chagua chakula...' : 'Select a food...'}
            </option>
            {kenyanFoods.map(food => (
              <option key={food} value={food}>
                {food.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          <button 
            className="btn" 
            onClick={predictFoodImpact}
            disabled={!selectedFood}
          >
            {language === 'sw' ? 'Tabiri Athari' : 'Predict Impact'}
          </button>
        </div>

        {foodPrediction && (
          <div style={{ marginTop: 16, padding: 16, backgroundColor: 'rgba(47, 243, 224, 0.1)', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 12px 0', color: 'var(--cyan)' }}>
              {foodPrediction.food}
            </h4>
            <div style={{ marginBottom: 12 }}>
              <strong>{language === 'sw' ? 'Athari ya Sukari ya Damu' : 'Blood Sugar Impact'}:</strong>
              <span style={{ 
                marginLeft: 8,
                padding: '2px 8px',
                borderRadius: 12,
                backgroundColor: foodPrediction.glucose_impact === 'high' || foodPrediction.glucose_impact === 'very_high' ? '#dc2626' : 
                                foodPrediction.glucose_impact === 'medium' ? '#f59e0b' : '#10b981',
                color: 'white',
                fontSize: '0.8rem'
              }}>
                {foodPrediction.glucose_impact}
              </span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>{language === 'sw' ? 'Ongezeko la Sukari linalotarajiwa' : 'Estimated Glucose Spike'}:</strong> +{foodPrediction.estimated_spike.toFixed(0)} mg/dL
            </div>
            <div>
              <strong>{language === 'sw' ? 'Mapendekezo' : 'Recommendations'}:</strong>
              <ul style={{ marginTop: 8 }}>
                {foodPrediction.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Smart Alerts */}
      <div className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Tahadhari za Akili' : 'Smart Alerts'}
        </h3>
        
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>🎉</div>
            <p>
              {language === 'sw' ? 
                'Hongera! Hakuna tahadhari za haraka. Endelea na kazi nzuri!' :
                'Great job! No urgent alerts. Keep up the good work!'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="list-item"
                style={{
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <h4 style={{ margin: 0, color: getSeverityColor(alert.severity) }}>
                    {alert.title[language] || alert.title.en}
                  </h4>
                </div>
                
                <p style={{ marginBottom: 16, lineHeight: 1.5 }}>
                  {alert.message[language] || alert.message.en}
                </p>
                
                {alert.recommendations && (
                  <div>
                    <strong style={{ color: 'var(--cyan)' }}>
                      {language === 'sw' ? 'Mapendekezo:' : 'Recommendations:'}
                    </strong>
                    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                      {(alert.recommendations[language] || alert.recommendations.en).map((rec, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button 
            className="btn btn-outline"
            onClick={loadAlerts}
          >
            {language === 'sw' ? 'Sasisha Tahadhari' : 'Refresh Alerts'}
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => window.location.href = '/readings'}
          >
            {language === 'sw' ? 'Ongeza Kipimo' : 'Add Reading'}
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => window.location.href = '/food-insights'}
          >
            {language === 'sw' ? 'Ona Vyakula' : 'View Foods'}
          </button>
        </div>
      </div>
    </div>
  );
}
