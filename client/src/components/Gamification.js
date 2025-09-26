import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export default function Gamification() {

  const { token } = useAuth();
  const { language } = useLanguage();
  const [progress, setProgress] = useState(null);
  const [badges, setBadges] = useState([]);
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/user-progress?lang=${language}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
        setBadges(data.badges);
        setDailyChallenges(data.daily_challenges);
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    } finally {
      setLoading(false);
    }
  }, [language, token]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>{language === 'sw' ? 'Maendeleo' : 'Progress'}</b>
        </div>
        <div className="accent-line" />
      </div>

      {/* Level & Stats */}
      <div className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Kiwango' : 'Level'} {progress?.level?.level}: {progress?.level?.title}
        </h3>
        <div className="grid-2" style={{ gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🔥</div>
            <div style={{ fontWeight: 'bold' }}>{progress?.current_streak}</div>
            <div>{language === 'sw' ? 'Siku mfululizo' : 'Day Streak'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>📊</div>
            <div style={{ fontWeight: 'bold' }}>{progress?.total_readings}</div>
            <div>{language === 'sw' ? 'Jumla ya Vipimo' : 'Total Readings'}</div>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Changamoto za Leo' : 'Today\'s Challenges'}
        </h3>
        {dailyChallenges.map(challenge => (
          <div key={challenge.id} className="list-item" style={{ 
            borderLeft: `4px solid ${challenge.status.completed ? '#10b981' : '#6b7280'}` 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>{challenge.icon}</span>
              <div>
                <strong>{challenge.name}</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                  {challenge.description}
                </div>
                {challenge.status.completed && (
                  <span style={{ color: '#10b981' }}>✓ Complete</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="card section">
          <h3 style={{ marginTop: 0 }}>
            {language === 'sw' ? 'Tuzo Zako' : 'Your Badges'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {badges.map(badge => (
              <div key={badge.id} className="list-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
                <div style={{ fontWeight: 'bold' }}>{badge.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
