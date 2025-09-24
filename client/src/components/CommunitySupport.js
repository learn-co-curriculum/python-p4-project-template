import React, { useState, useEffect } from 'react';

const CommunitySupport = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [language, setLanguage] = useState('english');
  const [userLocation, setUserLocation] = useState('Nairobi');
  const [supportGroups, setSupportGroups] = useState([]);
  const [healthTips, setHealthTips] = useState([]);
  const [communityEvents, setCommunityEvents] = useState([]);

  // Mock data for community support
  const mockSupportGroups = [
    {
      id: 1,
      name_english: 'Nairobi Diabetes Support Circle',
      name_swahili: 'Kikundi cha Msaada wa Kisukari Nairobi',
      location: 'Nairobi',
      meeting_day: 'Every Saturday',
      meeting_time: '2:00 PM',
      venue: 'Kenyatta National Hospital - Conference Room A',
      contact: '+254 700 123 456',
      members: 45,
      description_english: 'Weekly support group for diabetes management and healthy living',
      description_swahili: 'Kikundi cha kila wiki cha msaada wa kudhibiti kisukari na maisha mazuri',
      activities: ['Health education', 'Cooking demonstrations', 'Exercise sessions', 'Peer support'],
      language_support: ['English', 'Swahili', 'Kikuyu'],
      cost: 'Free',
      type: 'diabetes'
    },
    {
      id: 2,
      name_english: 'Mombasa Healthy Living Group',
      name_swahili: 'Kikundi cha Maisha Mazuri Mombasa',
      location: 'Mombasa',
      meeting_day: 'Twice a month',
      meeting_time: '10:00 AM',
      venue: 'Coast General Hospital - Community Hall',
      contact: '+254 722 987 654',
      members: 32,
      description_english: 'Community group focused on traditional foods and diabetes prevention',
      description_swahili: 'Kikundi cha jamii kinachozingatia vyakula vya kitamaduni na kuzuia kisukari',
      activities: ['Traditional cooking', 'Market visits', 'Nutrition education', 'Family support'],
      language_support: ['Swahili', 'Arabic', 'English'],
      cost: 'KSh 100 per session',
      type: 'nutrition'
    },
    {
      id: 3,
      name_english: 'Kisumu Wellness Warriors',
      name_swahili: 'Mashujaa wa Afya Kisumu',
      location: 'Kisumu',
      meeting_day: 'Every Sunday',
      meeting_time: '9:00 AM',
      venue: 'Jaramogi Oginga Odinga Teaching Hospital',
      contact: '+254 733 456 789',
      members: 28,
      description_english: 'Active community promoting exercise and healthy eating',
      description_swahili: 'Jamii inayohamasisha mazoezi na kula vizuri',
      activities: ['Group walks', 'Swimming', 'Healthy cooking', 'Health screenings'],
      language_support: ['Luo', 'Swahili', 'English'],
      cost: 'Free',
      type: 'exercise'
    }
  ];

  const mockHealthTips = [
    {
      id: 1,
      author: 'Dr. Mary Wanjiku',
      title_english: 'Managing Diabetes with Kenyan Foods',
      title_swahili: 'Kudhibiti Kisukari na Vyakula vya Kenya',
      tip_english: 'Replace ugali with mukimo for better blood sugar control. The beans and vegetables in mukimo provide fiber that slows glucose absorption.',
      tip_swahili: 'Badilisha ugali na mukimo ili kudhibiti sukari vizuri. Maharagwe na mboga katika mukimo hutoa nyuzi zinazopunguza kuvunjika kwa glukosi.',
      likes: 23,
      comments: 8,
      category: 'nutrition',
      date: '2024-01-20'
    },
    {
      id: 2,
      author: 'Mama Grace Akinyi',
      title_english: 'Traditional Exercise for Diabetes',
      title_swahili: 'Mazoezi ya Kitamaduni kwa Kisukari',
      tip_english: 'Try traditional dances like Ohangla or Benga for 30 minutes. It\'s fun exercise that helps control blood sugar!',
      tip_swahili: 'Jaribu ngoma za kitamaduni kama Ohangla au Benga kwa dakika 30. Ni mazoezi ya kufurahisha yanayosaidia kudhibiti sukari!',
      likes: 18,
      comments: 5,
      category: 'exercise',
      date: '2024-01-19'
    },
    {
      id: 3,
      author: 'John Mwangi',
      title_english: 'Seasonal Eating for Better Health',
      title_swahili: 'Kula kwa Misimu kwa Afya Bora',
      tip_english: 'During mango season, limit to 1 small mango per day. The natural sugars can spike blood glucose if you eat too many.',
      tip_swahili: 'Wakati wa misimu ya maembe, jizuie kwa embe dogo moja kwa siku. Sukari za asili zinaweza kuongeza glukosi ikiwa utakula nyingi.',
      likes: 15,
      comments: 3,
      category: 'seasonal',
      date: '2024-01-18'
    }
  ];

  const mockCommunityEvents = [
    {
      id: 1,
      title_english: 'Free Diabetes Screening',
      title_swahili: 'Uchunguzi wa Bure wa Kisukari',
      date: '2024-02-15',
      time: '8:00 AM - 4:00 PM',
      location: 'Uhuru Park, Nairobi',
      organizer: 'Kenya Diabetes Association',
      description_english: 'Free blood sugar testing and health education for the community',
      description_swahili: 'Upimaji wa bure wa sukari ya damu na elimu ya afya kwa jamii',
      cost: 'Free',
      registration_required: false
    },
    {
      id: 2,
      title_english: 'Healthy Cooking Workshop',
      title_swahili: 'Warsha ya Kupikia Vizuri',
      date: '2024-02-10',
      time: '10:00 AM - 2:00 PM',
      location: 'Mombasa Women\'s Hall',
      organizer: 'Coast Nutrition Network',
      description_english: 'Learn to prepare diabetes-friendly traditional meals',
      description_swahili: 'Jifunze kuandaa vyakula vya kitamaduni vinavyofaa kisukari',
      cost: 'KSh 500',
      registration_required: true
    }
  ];

  useEffect(() => {
    setSupportGroups(mockSupportGroups);
    setHealthTips(mockHealthTips);
    setCommunityEvents(mockCommunityEvents);
  }, []);

  const filteredGroups = supportGroups.filter(group => 
    userLocation === 'All' || group.location === userLocation
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🤝 Community Support</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">All Locations</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
          </select>
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

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {[
          { key: 'groups', label: 'Support Groups', label_swahili: 'Vikundi vya Msaada' },
          { key: 'tips', label: 'Community Tips', label_swahili: 'Vidokezo vya Jamii' },
          { key: 'events', label: 'Events', label_swahili: 'Matukio' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab.key ? '#4CAF50' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#4CAF50',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #4CAF50' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            {language === 'swahili' ? tab.label_swahili : tab.label}
          </button>
        ))}
      </div>

      {/* Support Groups Tab */}
      {activeTab === 'groups' && (
        <div>
          <h3>🏥 {language === 'swahili' ? 'Vikundi vya Msaada' : 'Support Groups'}</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredGroups.map(group => (
              <div key={group.id} style={{
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2196F3' }}>
                      {language === 'swahili' ? group.name_swahili : group.name_english}
                    </h4>
                    <p style={{ margin: '0', color: '#666' }}>
                      📍 {group.location} • 👥 {group.members} members
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {group.cost}
                  </span>
                </div>

                <p style={{ marginBottom: '15px' }}>
                  {language === 'swahili' ? group.description_swahili : group.description_english}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <strong>📅 Meeting:</strong> {group.meeting_day}<br />
                    <strong>🕐 Time:</strong> {group.meeting_time}<br />
                    <strong>📞 Contact:</strong> {group.contact}
                  </div>
                  <div>
                    <strong>📍 Venue:</strong><br />
                    {group.venue}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <strong>🎯 Activities:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {group.activities.map((activity, index) => (
                      <span key={index} style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong>🗣️ Languages:</strong> {group.language_support.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Tips Tab */}
      {activeTab === 'tips' && (
        <div>
          <h3>💡 {language === 'swahili' ? 'Vidokezo vya Jamii' : 'Community Health Tips'}</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {healthTips.map(tip => (
              <div key={tip.id} style={{
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#4CAF50' }}>
                    {language === 'swahili' ? tip.title_swahili : tip.title_english}
                  </h4>
                  <span style={{
                    backgroundColor: '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {tip.category}
                  </span>
                </div>
                
                <p style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                  {language === 'swahili' ? tip.tip_swahili : tip.tip_english}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                  <span>By {tip.author} • {tip.date}</span>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <span>👍 {tip.likes}</span>
                    <span>💬 {tip.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <h3>📅 {language === 'swahili' ? 'Matukio ya Jamii' : 'Community Events'}</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {communityEvents.map(event => (
              <div key={event.id} style={{
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                borderLeft: '4px solid #FF9800'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#FF9800' }}>
                      {language === 'swahili' ? event.title_swahili : event.title_english}
                    </h4>
                    <p style={{ margin: '0', color: '#666' }}>
                      📅 {event.date} • 🕐 {event.time}
                    </p>
                  </div>
                  <span style={{
                    backgroundColor: event.cost === 'Free' ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {event.cost}
                  </span>
                </div>

                <p style={{ marginBottom: '15px' }}>
                  {language === 'swahili' ? event.description_swahili : event.description_english}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <strong>📍 Location:</strong> {event.location}<br />
                    <strong>🏢 Organizer:</strong> {event.organizer}
                  </div>
                  <div>
                    <strong>📝 Registration:</strong> {event.registration_required ? 'Required' : 'Not required'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Contact Section */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4>🆘 {language === 'swahili' ? 'Msaada wa Dharura' : 'Emergency Support'}</h4>
        <p>{language === 'swahili' ? 'Kama una hali ya dharura ya kisukari:' : 'If you have a diabetes emergency:'}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
          <div>
            <strong>🚨 Emergency:</strong><br />
            <span style={{ fontSize: '18px', color: '#F44336' }}>999 / 911</span>
          </div>
          <div>
            <strong>🏥 Diabetes Helpline:</strong><br />
            <span style={{ fontSize: '18px', color: '#2196F3' }}>0800 724 000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport;
