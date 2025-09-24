import React, { useState, useEffect } from 'react';

const HealthCharts = () => {
  const [chartData, setChartData] = useState({});
  const [selectedChart, setSelectedChart] = useState('glucose');
  const [timeRange, setTimeRange] = useState('week');
  const [language, setLanguage] = useState('english');

  // Mock health data
  const mockHealthData = {
    glucose: {
      week: [
        { date: '2024-01-15', value: 95, meal: 'Githeri with vegetables', time: '08:00' },
        { date: '2024-01-16', value: 142, meal: 'Ugali with sukuma wiki', time: '12:30' },
        { date: '2024-01-17', value: 88, meal: 'Millet porridge', time: '07:30' },
        { date: '2024-01-18', value: 156, meal: 'Rice with beans', time: '19:00' },
        { date: '2024-01-19', value: 92, meal: 'Traditional vegetables', time: '08:15' },
        { date: '2024-01-20', value: 134, meal: 'Chapati with tea', time: '16:00' },
        { date: '2024-01-21', value: 98, meal: 'Fish with vegetables', time: '13:00' }
      ],
      month: [
        { date: '2024-01-01', value: 105, meal: 'New Year feast', time: '14:00' },
        { date: '2024-01-08', value: 98, meal: 'Githeri', time: '12:00' },
        { date: '2024-01-15', value: 142, meal: 'Ugali', time: '19:00' },
        { date: '2024-01-22', value: 89, meal: 'Vegetables only', time: '18:30' },
        { date: '2024-01-29', value: 156, meal: 'Traditional feast', time: '15:00' }
      ]
    },
    weight: {
      week: [
        { date: '2024-01-15', value: 72.5 },
        { date: '2024-01-16', value: 72.3 },
        { date: '2024-01-17', value: 72.1 },
        { date: '2024-01-18', value: 72.4 },
        { date: '2024-01-19', value: 72.0 },
        { date: '2024-01-20', value: 71.8 },
        { date: '2024-01-21', value: 71.9 }
      ],
      month: [
        { date: '2024-01-01', value: 73.2 },
        { date: '2024-01-08', value: 72.8 },
        { date: '2024-01-15', value: 72.5 },
        { date: '2024-01-22', value: 72.1 },
        { date: '2024-01-29', value: 71.9 }
      ]
    },
    bloodPressure: {
      week: [
        { date: '2024-01-15', systolic: 118, diastolic: 78 },
        { date: '2024-01-16', systolic: 122, diastolic: 82 },
        { date: '2024-01-17', systolic: 115, diastolic: 75 },
        { date: '2024-01-18', systolic: 128, diastolic: 85 },
        { date: '2024-01-19', systolic: 120, diastolic: 80 },
        { date: '2024-01-20', systolic: 116, diastolic: 76 },
        { date: '2024-01-21', systolic: 119, diastolic: 79 }
      ]
    }
  };

  useEffect(() => {
    setChartData(mockHealthData);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGlucoseColor = (value) => {
    if (value < 80) return '#FF5722'; // Too low
    if (value <= 140) return '#4CAF50'; // Normal
    if (value <= 180) return '#FF9800'; // Elevated
    return '#F44336'; // High
  };

  const getBPColor = (systolic, diastolic) => {
    if (systolic < 120 && diastolic < 80) return '#4CAF50'; // Normal
    if (systolic < 130 && diastolic < 80) return '#FF9800'; // Elevated
    return '#F44336'; // High
  };

  const SimpleLineChart = ({ data, dataKey, color, unit = '', showMeals = false }) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const maxValue = Math.max(...data.map(d => d[dataKey] || Math.max(d.systolic || 0, d.diastolic || 0)));
    const minValue = Math.min(...data.map(d => d[dataKey] || Math.min(d.systolic || 0, d.diastolic || 0)));
    const range = maxValue - minValue;
    const padding = range * 0.1;

    const chartHeight = 200;
    const chartWidth = 600;

    return (
      <div style={{ position: 'relative', width: '100%', height: chartHeight + 100 }}>
        <svg width="100%" height={chartHeight + 60} viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line
                x1={50}
                y1={20 + ratio * chartHeight}
                x2={chartWidth - 20}
                y2={20 + ratio * chartHeight}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
              <text
                x={40}
                y={25 + ratio * chartHeight}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {Math.round(maxValue + padding - ratio * (range + 2 * padding))}
              </text>
            </g>
          ))}

          {/* Data line */}
          <polyline
            points={data.map((d, index) => {
              const x = 50 + (index / (data.length - 1)) * (chartWidth - 70);
              const value = d[dataKey] || d.systolic || 0;
              const y = 20 + ((maxValue + padding - value) / (range + 2 * padding)) * chartHeight;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="3"
          />

          {/* Data points */}
          {data.map((d, index) => {
            const x = 50 + (index / (data.length - 1)) * (chartWidth - 70);
            const value = d[dataKey] || d.systolic || 0;
            const y = 20 + ((maxValue + padding - value) / (range + 2 * padding)) * chartHeight;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={selectedChart === 'glucose' ? getGlucoseColor(value) : color}
                />
                <text
                  x={x}
                  y={chartHeight + 40}
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                >
                  {formatDate(d.date)}
                </text>
                {showMeals && d.meal && (
                  <text
                    x={x}
                    y={chartHeight + 55}
                    fontSize="8"
                    fill="#999"
                    textAnchor="middle"
                    style={{ maxWidth: '80px' }}
                  >
                    {d.meal.substring(0, 15)}...
                  </text>
                )}
              </g>
            );
          })}

          {/* Diastolic line for BP */}
          {selectedChart === 'bloodPressure' && (
            <polyline
              points={data.map((d, index) => {
                const x = 50 + (index / (data.length - 1)) * (chartWidth - 70);
                const y = 20 + ((maxValue + padding - d.diastolic) / (range + 2 * padding)) * chartHeight;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#FF9800"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>
      </div>
    );
  };

  const currentData = chartData[selectedChart]?.[timeRange] || [];

  const getChartTitle = () => {
    const titles = {
      glucose: language === 'swahili' ? 'Viwango vya Sukari ya Damu' : 'Blood Glucose Levels',
      weight: language === 'swahili' ? 'Uzito wa Mwili' : 'Body Weight',
      bloodPressure: language === 'swahili' ? 'Shinikizo la Damu' : 'Blood Pressure'
    };
    return titles[selectedChart];
  };

  const getInsights = () => {
    if (!currentData.length) return [];

    const insights = [];
    
    if (selectedChart === 'glucose') {
      const avgGlucose = currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length;
      const highReadings = currentData.filter(d => d.value > 140).length;
      
      insights.push({
        type: 'average',
        value: Math.round(avgGlucose),
        text: language === 'swahili' 
          ? `Wastani wa sukari: ${Math.round(avgGlucose)} mg/dL`
          : `Average glucose: ${Math.round(avgGlucose)} mg/dL`,
        color: getGlucoseColor(avgGlucose)
      });
      
      if (highReadings > 0) {
        insights.push({
          type: 'warning',
          text: language === 'swahili'
            ? `${highReadings} vipimo vya juu (>140 mg/dL)`
            : `${highReadings} high readings (>140 mg/dL)`,
          color: '#FF9800'
        });
      }
    }
    
    return insights;
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (selectedChart === 'glucose') {
      const highReadings = currentData.filter(d => d.value > 140);
      if (highReadings.length > 0) {
        recommendations.push({
          text: language === 'swahili'
            ? 'Zingatia kupunguza sehemu za ugali na kuongeza mboga'
            : 'Consider reducing ugali portions and adding more vegetables',
          icon: '🥬'
        });
        recommendations.push({
          text: language === 'swahili'
            ? 'Jaribu kutembea kwa dakika 10-15 baada ya chakula'
            : 'Try walking 10-15 minutes after meals',
          icon: '🚶‍♂️'
        });
      }
      
      const lowReadings = currentData.filter(d => d.value < 80);
      if (lowReadings.length > 0) {
        recommendations.push({
          text: language === 'swahili'
            ? 'Kula chakula kidogo chenye kabohaidreti za haraka'
            : 'Have a small snack with quick carbohydrates',
          icon: '🍌'
        });
      }
    }
    
    return recommendations;
  };

  const insights = getInsights();
  const recommendations = getRecommendations();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>📊 Health Analytics Dashboard</h1>
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

      {/* Chart Type Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'glucose', label: 'Blood Glucose', label_swahili: 'Sukari ya Damu', icon: '🩸' },
            { key: 'weight', label: 'Weight', label_swahili: 'Uzito', icon: '⚖️' },
            { key: 'bloodPressure', label: 'Blood Pressure', label_swahili: 'Shinikizo la Damu', icon: '💓' }
          ].map(chart => (
            <button
              key={chart.key}
              onClick={() => setSelectedChart(chart.key)}
              style={{
                padding: '10px 16px',
                backgroundColor: selectedChart === chart.key ? '#4CAF50' : 'white',
                color: selectedChart === chart.key ? 'white' : '#4CAF50',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{chart.icon}</span>
              {language === 'swahili' ? chart.label_swahili : chart.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Range Selector */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { key: 'week', label: 'This Week', label_swahili: 'Wiki Hii' },
            { key: 'month', label: 'This Month', label_swahili: 'Mwezi Huu' }
          ].map(range => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              style={{
                padding: '8px 16px',
                backgroundColor: timeRange === range.key ? '#FF9800' : 'transparent',
                color: timeRange === range.key ? 'white' : '#FF9800',
                border: '1px solid #FF9800',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {language === 'swahili' ? range.label_swahili : range.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Chart */}
        <div>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h3>{getChartTitle()}</h3>
            
            {currentData.length > 0 ? (
              <SimpleLineChart
                data={currentData}
                dataKey={selectedChart === 'bloodPressure' ? 'systolic' : 'value'}
                color={selectedChart === 'glucose' ? '#2196F3' : selectedChart === 'weight' ? '#4CAF50' : '#F44336'}
                showMeals={selectedChart === 'glucose'}
              />
            ) : (
              <div style={{ 
                padding: '60px', 
                textAlign: 'center', 
                color: '#666',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <h3>No data available</h3>
                <p>Start tracking your {selectedChart} to see trends</p>
              </div>
            )}

            {/* Legend for Blood Pressure */}
            {selectedChart === 'bloodPressure' && (
              <div style={{ marginTop: '15px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '3px', backgroundColor: '#F44336' }}></div>
                  <span style={{ fontSize: '14px' }}>Systolic</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '20px', height: '3px', backgroundColor: '#FF9800', borderStyle: 'dashed' }}></div>
                  <span style={{ fontSize: '14px' }}>Diastolic</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div>
          {/* Insights */}
          {insights.length > 0 && (
            <div style={{
              padding: '20px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>📈 {language === 'swahili' ? 'Uchanganuzi' : 'Insights'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      backgroundColor: 'white',
                      borderLeft: `4px solid ${insight.color}`,
                      borderRadius: '4px'
                    }}
                  >
                    {insight.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div style={{
              padding: '20px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h4>💡 {language === 'swahili' ? 'Mapendekezo' : 'Recommendations'}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{rec.icon}</span>
                    <span style={{ fontSize: '14px' }}>{rec.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div style={{
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <h4>📊 {language === 'swahili' ? 'Takwimu za Haraka' : 'Quick Stats'}</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{language === 'swahili' ? 'Vipimo' : 'Readings'}:</span>
                <strong>{currentData.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{language === 'swahili' ? 'Muda' : 'Period'}:</span>
                <strong>{timeRange === 'week' ? '7 days' : '1 month'}</strong>
              </div>
              {selectedChart === 'glucose' && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{language === 'swahili' ? 'Katika kiwango' : 'In range'}:</span>
                  <strong>
                    {currentData.filter(d => d.value >= 80 && d.value <= 140).length}/{currentData.length}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCharts;
