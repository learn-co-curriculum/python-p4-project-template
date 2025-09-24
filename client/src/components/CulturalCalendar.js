import React, { useState, useEffect } from 'react';

const CulturalCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [language, setLanguage] = useState('english');
  const [viewMode, setViewMode] = useState('month'); // month, week, list

  // Kenyan cultural events and health-related observances
  const culturalEvents = [
    {
      id: 1,
      date: '2024-01-01',
      name_english: 'New Year - Health Resolution Day',
      name_swahili: 'Mwaka Mpya - Siku ya Azimio la Afya',
      type: 'health_awareness',
      description_english: 'Start the year with healthy eating habits using traditional Kenyan foods',
      description_swahili: 'Anza mwaka na tabia za kula vizuri kwa kutumia vyakula vya kitamaduni vya Kenya',
      health_tips: [
        'Set realistic health goals for the year',
        'Include more traditional vegetables in your diet',
        'Plan regular glucose monitoring schedule'
      ],
      traditional_foods: ['Githeri', 'Sukuma Wiki', 'Millet Porridge'],
      color: '#4CAF50'
    },
    {
      id: 2,
      date: '2024-02-14',
      name_english: 'Heart Health Awareness Day',
      name_swahili: 'Siku ya Uelewa wa Afya ya Moyo',
      type: 'health_awareness',
      description_english: 'Focus on heart-healthy Kenyan foods and diabetes prevention',
      description_swahili: 'Zingatia vyakula vya Kenya vinavyofaa moyo na kuzuia kisukari',
      health_tips: [
        'Choose foods rich in omega-3 like tilapia',
        'Reduce salt intake in traditional cooking',
        'Include more fiber-rich foods like beans'
      ],
      traditional_foods: ['Tilapia', 'Groundnuts', 'Green Grams'],
      color: '#F44336'
    },
    {
      id: 3,
      date: '2024-03-08',
      name_english: 'International Women\'s Day - Maternal Health',
      name_swahili: 'Siku ya Kimataifa ya Wanawake - Afya ya Mama',
      type: 'health_awareness',
      description_english: 'Focus on women\'s health and gestational diabetes prevention',
      description_swahili: 'Zingatia afya ya wanawake na kuzuia kisukari cha ujauzito',
      health_tips: [
        'Pregnant women should monitor blood sugar regularly',
        'Include iron-rich traditional foods',
        'Maintain healthy weight during pregnancy'
      ],
      traditional_foods: ['Amaranth', 'Sweet Potatoes', 'Indigenous Vegetables'],
      color: '#E91E63'
    },
    {
      id: 4,
      date: '2024-04-07',
      name_english: 'World Health Day',
      name_swahili: 'Siku ya Kimataifa ya Afya',
      type: 'health_awareness',
      description_english: 'Celebrate health with traditional Kenyan wellness practices',
      description_swahili: 'Sherehekea afya na desturi za utandawazi za Kenya',
      health_tips: [
        'Practice traditional physical activities',
        'Use herbal teas for wellness',
        'Maintain community health practices'
      ],
      traditional_foods: ['Herbal Teas', 'Traditional Porridge', 'Fermented Foods'],
      color: '#2196F3'
    },
    {
      id: 5,
      date: '2024-06-01',
      name_english: 'Madaraka Day - National Health Reflection',
      name_swahili: 'Siku ya Madaraka - Tafakari ya Afya ya Kitaifa',
      type: 'national_holiday',
      description_english: 'Reflect on national health goals and traditional food heritage',
      description_swahili: 'Tafakari juu ya malengo ya afya ya kitaifa na urithi wa vyakula vya kitamaduni',
      health_tips: [
        'Celebrate with healthy traditional foods',
        'Share health knowledge with community',
        'Practice portion control during celebrations'
      ],
      traditional_foods: ['Nyama Choma (lean cuts)', 'Mukimo', 'Traditional Fruits'],
      color: '#FF9800'
    },
    {
      id: 6,
      date: '2024-07-15',
      name_english: 'Ramadan Health Focus',
      name_swahili: 'Mwezi wa Ramadani - Mkazo wa Afya',
      type: 'religious',
      description_english: 'Healthy fasting practices and diabetes management during Ramadan',
      description_swahili: 'Mazoezi mazuri ya kufunga na kudhibiti kisukari wakati wa Ramadani',
      health_tips: [
        'Monitor blood sugar during fasting',
        'Break fast with dates and water',
        'Choose complex carbohydrates for suhoor'
      ],
      traditional_foods: ['Dates', 'Whole Grain Porridge', 'Vegetable Soup'],
      color: '#9C27B0'
    },
    {
      id: 7,
      date: '2024-08-15',
      name_english: 'Harvest Season - Fresh Produce Focus',
      name_swahili: 'Msimu wa Mavuno - Mkazo wa Mazao Mapya',
      type: 'seasonal',
      description_english: 'Celebrate harvest season with fresh, diabetes-friendly produce',
      description_swahili: 'Sherehekea msimu wa mavuno na mazao mapya yanayofaa kisukari',
      health_tips: [
        'Include seasonal vegetables in meals',
        'Preserve nutrients through proper cooking',
        'Take advantage of fresh, local produce'
      ],
      traditional_foods: ['Fresh Maize', 'Pumpkin Leaves', 'Sweet Potatoes'],
      color: '#4CAF50'
    },
    {
      id: 8,
      date: '2024-10-20',
      name_english: 'Mashujaa Day - Heroes of Health',
      name_swahili: 'Siku ya Mashujaa - Mashujaa wa Afya',
      type: 'national_holiday',
      description_english: 'Honor health heroes and commit to personal health heroism',
      description_swahili: 'Heshimu mashujaa wa afya na jitolee kwa ujasiri wa afya ya kibinafsi',
      health_tips: [
        'Be your own health hero',
        'Share healthy recipes with others',
        'Support community health initiatives'
      ],
      traditional_foods: ['Power Foods Combo', 'Protein-Rich Meals', 'Antioxidant Foods'],
      color: '#FF5722'
    },
    {
      id: 9,
      date: '2024-11-14',
      name_english: 'World Diabetes Day',
      name_swahili: 'Siku ya Kimataifa ya Kisukari',
      type: 'health_awareness',
      description_english: 'Global diabetes awareness with focus on Kenyan traditional management',
      description_swahili: 'Uelewa wa kimataifa wa kisukari ukizingatia udhibiti wa kitamaduni wa Kenya',
      health_tips: [
        'Get diabetes screening',
        'Learn about traditional diabetes-friendly foods',
        'Join diabetes support groups'
      ],
      traditional_foods: ['Low GI Traditional Foods', 'Herbal Remedies', 'Fiber-Rich Meals'],
      color: '#2196F3'
    },
    {
      id: 10,
      date: '2024-12-12',
      name_english: 'Jamhuri Day - National Unity in Health',
      name_swahili: 'Siku ya Jamhuri - Umoja wa Kitaifa katika Afya',
      type: 'national_holiday',
      description_english: 'Celebrate national unity through shared healthy eating traditions',
      description_swahili: 'Sherehekea umoja wa kitaifa kupitia desturi za pamoja za kula vizuri',
      health_tips: [
        'Share healthy recipes across communities',
        'Practice inclusive health celebrations',
        'Maintain healthy habits during festivities'
      ],
      traditional_foods: ['Multi-Cultural Healthy Dishes', 'Community Feast Foods', 'Unity Meals'],
      color: '#4CAF50'
    }
  ];

  const getCurrentMonthEvents = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return culturalEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return culturalEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'health_awareness': return '#2196F3';
      case 'national_holiday': return '#4CAF50';
      case 'religious': return '#9C27B0';
      case 'seasonal': return '#FF9800';
      default: return '#757575';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthEvents = getCurrentMonthEvents();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🗓️ Kenyan Cultural Health Calendar</h1>
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

      {/* View Mode Selector */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['month', 'list'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === mode ? '#4CAF50' : 'transparent',
                color: viewMode === mode ? 'white' : '#4CAF50',
                border: '1px solid #4CAF50',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Calendar/List View */}
        <div>
          {viewMode === 'month' ? (
            <>
              {/* Month Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
              }}>
                <button
                  onClick={() => navigateMonth(-1)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Previous
                </button>
                <h2>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <button
                  onClick={() => navigateMonth(1)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Next →
                </button>
              </div>

              {/* Month Events */}
              <div>
                <h3>Events This Month ({monthEvents.length})</h3>
                {monthEvents.length > 0 ? (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    {monthEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          padding: '15px',
                          backgroundColor: 'white',
                          border: `3px solid ${event.color}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, color: event.color }}>
                            {language === 'swahili' ? event.name_swahili : event.name_english}
                          </h4>
                          <span style={{
                            backgroundColor: getEventTypeColor(event.type),
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}>
                            {event.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                          📅 {formatDate(event.date)}
                        </p>
                        <p style={{ margin: 0 }}>
                          {language === 'swahili' ? event.description_swahili : event.description_english}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#666',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                  }}>
                    <h3>No events this month</h3>
                    <p>Check other months for cultural health events</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* List View */
            <div>
              <h3>All Cultural Health Events</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {culturalEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    style={{
                      padding: '15px',
                      backgroundColor: 'white',
                      border: `2px solid ${event.color}`,
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, color: event.color }}>
                        {language === 'swahili' ? event.name_swahili : event.name_english}
                      </h4>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        {formatDate(event.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Upcoming Events */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h3>🔜 Upcoming Events</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    padding: '10px',
                    backgroundColor: 'white',
                    borderLeft: `4px solid ${event.color}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {language === 'swahili' ? event.name_swahili : event.name_english}
                  </div>
                  <div style={{ color: '#666' }}>
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Details */}
          {selectedEvent && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: 'white', 
              border: `3px solid ${selectedEvent.color}`,
              borderRadius: '8px' 
            }}>
              <h3 style={{ color: selectedEvent.color, marginBottom: '15px' }}>
                {language === 'swahili' ? selectedEvent.name_swahili : selectedEvent.name_english}
              </h3>
              
              <p style={{ marginBottom: '15px' }}>
                <strong>📅 Date:</strong> {formatDate(selectedEvent.date)}
              </p>
              
              <p style={{ marginBottom: '15px' }}>
                {language === 'swahili' ? selectedEvent.description_swahili : selectedEvent.description_english}
              </p>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>💡 Health Tips:</strong>
                <ul style={{ marginTop: '5px' }}>
                  {selectedEvent.health_tips.map((tip, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{tip}</li>
                  ))}
                </ul>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <strong>🍽️ Recommended Foods:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                  {selectedEvent.traditional_foods.map((food, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: selectedEvent.color,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          )}

          {/* Health Calendar Stats */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h4>📊 Calendar Stats</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Health Events:</span>
                <strong>{culturalEvents.filter(e => e.type === 'health_awareness').length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>National Holidays:</span>
                <strong>{culturalEvents.filter(e => e.type === 'national_holiday').length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Seasonal Events:</span>
                <strong>{culturalEvents.filter(e => e.type === 'seasonal').length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Events:</span>
                <strong>{culturalEvents.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalCalendar;
