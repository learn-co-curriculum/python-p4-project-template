import React, { useState, useEffect, useRef } from 'react';

const EmergencyResponse = () => {
  const [language, setLanguage] = useState('english');
  const [userLocation, setUserLocation] = useState(null);
  const [emergencyType, setEmergencyType] = useState('');
  const [symptoms, setSymptoms] = useState({});
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [nearestHospitals, setNearestHospitals] = useState([]);
  const [emergencyProtocol, setEmergencyProtocol] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [locationPermission, setLocationPermission] = useState('prompt');
  
  const emergencyAudioRef = useRef(null);

  // Emergency types with translations
  const emergencyTypes = {
    severe_hypoglycemia: {
      english: 'Severe Low Blood Sugar',
      swahili: 'Sukari ya Damu ya Chini Sana',
      color: '#F44336',
      icon: '🩸'
    },
    severe_hyperglycemia: {
      english: 'Severe High Blood Sugar',
      swahili: 'Sukari ya Damu ya Juu Sana',
      color: '#FF9800',
      icon: '📈'
    },
    diabetic_ketoacidosis: {
      english: 'Diabetic Ketoacidosis (DKA)',
      swahili: 'Asidi ya Kisukari (DKA)',
      color: '#D32F2F',
      icon: '🚨'
    },
    unconscious: {
      english: 'Unconscious',
      swahili: 'Amezimia',
      color: '#B71C1C',
      icon: '😵'
    },
    chest_pain: {
      english: 'Chest Pain',
      swahili: 'Maumivu ya Kifua',
      color: '#E91E63',
      icon: '💔'
    },
    difficulty_breathing: {
      english: 'Difficulty Breathing',
      swahili: 'Shida ya Kupumua',
      color: '#9C27B0',
      icon: '🫁'
    },
    general_emergency: {
      english: 'General Emergency',
      swahili: 'Dharura ya Jumla',
      color: '#FF5722',
      icon: '🆘'
    }
  };

  // Kenyan emergency numbers
  const emergencyNumbers = {
    national_emergency: { number: '999', name: 'National Emergency', name_swahili: 'Dharura ya Kitaifa' },
    kenya_red_cross: { number: '1199', name: 'Kenya Red Cross', name_swahili: 'Msalaba Mwekundu Kenya' },
    diabetes_helpline: { number: '0800 724 000', name: 'Diabetes Helpline', name_swahili: 'Simu ya Msaada wa Kisukari' },
    st_john_ambulance: { number: '+254 20 2210000', name: 'St. John Ambulance', name_swahili: 'Ambulansi ya St. John' }
  };

  useEffect(() => {
    // Request location permission on component mount
    requestLocationPermission();
    
    // Load emergency contacts from localStorage
    const savedContacts = localStorage.getItem('emergency_contacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, []);

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Location error:', error);
          setLocationPermission('denied');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationPermission('unavailable');
    }
  };

  const triggerEmergency = async (type) => {
    setEmergencyType(type);
    setEmergencyActive(true);
    
    // Play emergency sound
    if (emergencyAudioRef.current) {
      emergencyAudioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
    
    // Mock API call to trigger emergency response
    try {
      const response = await fetch('/api/emergency/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergency_type: type,
          user_location: userLocation,
          symptoms: symptoms,
          emergency_contacts: emergencyContacts
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setNearestHospitals(data.nearest_hospitals || []);
        setEmergencyProtocol(data.protocol);
      }
    } catch (error) {
      console.error('Emergency trigger failed:', error);
      // Fallback to offline mode
      setEmergencyProtocol(getOfflineProtocol(type));
    }
  };

  const getOfflineProtocol = (type) => {
    // Fallback protocols when offline
    const protocols = {
      severe_hypoglycemia: {
        immediate_actions_english: [
          "Give 15-20g of fast-acting carbs (glucose tablets, honey, or sugar)",
          "If unconscious, DO NOT give anything by mouth",
          "Call 999 if person doesn't improve in 15 minutes"
        ],
        immediate_actions_swahili: [
          "Mpe kabohaidreti za haraka (vidonge vya glukosi, asali, au sukari)",
          "Kama amezimia, USIMPE chochote kinywani",
          "Piga 999 kama hajapona ndani ya dakika 15"
        ]
      },
      severe_hyperglycemia: {
        immediate_actions_english: [
          "Check blood sugar - if over 400 mg/dL, seek immediate medical help",
          "Drink water to prevent dehydration",
          "Take prescribed insulin if available"
        ],
        immediate_actions_swahili: [
          "Pima sukari - kama ni zaidi ya 400 mg/dL, tafuta msaada wa haraka",
          "Nywa maji kuzuia ukame",
          "Chukua insulini uliyoagiziwa kama unazo"
        ]
      }
    };
    
    return protocols[type] || protocols.severe_hypoglycemia;
  };

  const callEmergencyNumber = (number) => {
    if ('tel:' && window.location.protocol !== 'https:') {
      alert(`Call ${number} immediately for emergency assistance`);
    } else {
      window.location.href = `tel:${number}`;
    }
  };

  const shareLocation = async () => {
    if (userLocation && navigator.share) {
      try {
        await navigator.share({
          title: 'Emergency Location',
          text: `Emergency at coordinates: ${userLocation.latitude}, ${userLocation.longitude}`,
          url: `https://maps.google.com/?q=${userLocation.latitude},${userLocation.longitude}`
        });
      } catch (error) {
        // Fallback to copying to clipboard
        const locationText = `Emergency Location: ${userLocation.latitude}, ${userLocation.longitude}`;
        navigator.clipboard.writeText(locationText);
        alert('Location copied to clipboard');
      }
    }
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setEmergencyType('');
    setEmergencyProtocol(null);
    setNearestHospitals([]);
    
    if (emergencyAudioRef.current) {
      emergencyAudioRef.current.pause();
      emergencyAudioRef.current.currentTime = 0;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Emergency Audio */}
      <audio ref={emergencyAudioRef} loop>
        <source src="/emergency-alert.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: emergencyActive ? '#F44336' : '#333' }}>
          🚨 {language === 'swahili' ? 'Mfumo wa Dharura' : 'Emergency Response System'}
        </h1>
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

      {/* Emergency Status */}
      {emergencyActive && (
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          border: '2px solid #F44336',
          borderRadius: '8px',
          marginBottom: '20px',
          animation: 'pulse 1s infinite'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#F44336', margin: 0 }}>
              🚨 {language === 'swahili' ? 'DHARURA INAENDELEA' : 'EMERGENCY ACTIVE'}
            </h2>
            <button
              onClick={cancelEmergency}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {language === 'swahili' ? 'Sitisha Dharura' : 'Cancel Emergency'}
            </button>
          </div>
          <p style={{ margin: '10px 0 0 0' }}>
            {language === 'swahili' 
              ? `Aina ya dharura: ${emergencyTypes[emergencyType]?.swahili || emergencyType}`
              : `Emergency type: ${emergencyTypes[emergencyType]?.english || emergencyType}`
            }
          </p>
        </div>
      )}

      {/* Quick Emergency Buttons */}
      {!emergencyActive && (
        <div style={{ marginBottom: '30px' }}>
          <h3>{language === 'swahili' ? 'Dharura za Haraka' : 'Quick Emergency Actions'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            {Object.entries(emergencyTypes).map(([key, emergency]) => (
              <button
                key={key}
                onClick={() => triggerEmergency(key)}
                style={{
                  padding: '20px',
                  backgroundColor: emergency.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{emergency.icon}</div>
                {language === 'swahili' ? emergency.swahili : emergency.english}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Protocol */}
      {emergencyActive && emergencyProtocol && (
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#F44336' }}>
            {language === 'swahili' ? 'Hatua za Dharura' : 'Emergency Protocol'}
          </h3>
          <div style={{ marginBottom: '15px' }}>
            <strong>{language === 'swahili' ? 'Hatua za Haraka:' : 'Immediate Actions:'}</strong>
            <ul style={{ marginTop: '10px' }}>
              {(language === 'swahili' 
                ? emergencyProtocol.immediate_actions_swahili 
                : emergencyProtocol.immediate_actions_english
              ).map((action, index) => (
                <li key={index} style={{ marginBottom: '5px', fontSize: '16px' }}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Emergency Numbers */}
      <div style={{ marginBottom: '30px' }}>
        <h3>{language === 'swahili' ? 'Nambari za Dharura' : 'Emergency Numbers'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {Object.entries(emergencyNumbers).map(([key, contact]) => (
            <div
              key={key}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                border: '2px solid #F44336',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#F44336' }}>
                {language === 'swahili' ? contact.name_swahili : contact.name}
              </h4>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
                {contact.number}
              </div>
              <button
                onClick={() => callEmergencyNumber(contact.number)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                📞 {language === 'swahili' ? 'Piga Simu' : 'Call Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nearest Hospitals */}
      {nearestHospitals.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>{language === 'swahili' ? 'Hospitali za Karibu' : 'Nearest Hospitals'}</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {nearestHospitals.slice(0, 3).map((hospital, index) => (
              <div
                key={hospital.id}
                style={{
                  padding: '15px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  borderLeft: '4px solid #2196F3'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#2196F3' }}>{hospital.name}</h4>
                    <p style={{ margin: '0 0 5px 0' }}>📍 {hospital.location}</p>
                    <p style={{ margin: '0 0 10px 0' }}>📞 {hospital.emergency_phone}</p>
                    {hospital.has_diabetes_specialist && (
                      <span style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {language === 'swahili' ? 'Mtaalamu wa Kisukari' : 'Diabetes Specialist'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => callEmergencyNumber(hospital.emergency_phone)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📞 {language === 'swahili' ? 'Piga' : 'Call'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Sharing */}
      <div style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>{language === 'swahili' ? 'Shiriki Mahali Pako' : 'Share Your Location'}</h4>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <strong>{language === 'swahili' ? 'Hali ya Mahali:' : 'Location Status:'}</strong>
            <span style={{
              marginLeft: '10px',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              backgroundColor: locationPermission === 'granted' ? '#4CAF50' : '#FF9800',
              color: 'white'
            }}>
              {locationPermission === 'granted' 
                ? (language === 'swahili' ? 'Imepatikana' : 'Available')
                : (language === 'swahili' ? 'Haijapatikana' : 'Not Available')
              }
            </span>
          </div>
          
          {userLocation && (
            <>
              <button
                onClick={shareLocation}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                📍 {language === 'swahili' ? 'Shiriki Mahali' : 'Share Location'}
              </button>
              
              <button
                onClick={requestLocationPermission}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🔄 {language === 'swahili' ? 'Sasisha Mahali' : 'Update Location'}
              </button>
            </>
          )}
        </div>
        
        {userLocation && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            {language === 'swahili' ? 'Mahali yako:' : 'Your location:'} {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </div>
        )}
      </div>

      {/* Emergency Tips */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff3e0',
        borderRadius: '8px'
      }}>
        <h4>{language === 'swahili' ? 'Vidokezo vya Dharura' : 'Emergency Tips'}</h4>
        <ul style={{ marginTop: '10px' }}>
          {language === 'swahili' ? [
            'Hifadhi nambari za dharura kwenye simu yako',
            'Jua mahali pa hospitali ya karibu',
            'Beba kila wakati kitambulisho cha kimatibabu',
            'Weka familia na marafiki wajue hali yako ya kisukari',
            'Hifadhi dawa za dharura mahali pazuri'
          ] : [
            'Keep emergency numbers saved in your phone',
            'Know the location of nearest hospital',
            'Always carry medical identification',
            'Ensure family and friends know about your diabetes',
            'Store emergency medications properly'
          ].map((tip, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EmergencyResponse;
