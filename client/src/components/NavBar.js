import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';

export default function NavBar() {
  const { isAuthed, logout, user, token } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();
  const history = useHistory();
  const [hasReading, setHasReading] = useState(null);
  const profileComplete = Boolean(user?.height_cm && user?.weight_kg);
  const educationDone = typeof window !== 'undefined' && localStorage.getItem('education_done') === 'true';

  useEffect(() => {
    let mounted = true;
    async function checkReadings() {
      if (!isAuthed) { setHasReading(false); return; }
      try {
        const res = await fetch('/readings', { headers: { Authorization: `Bearer ${token}` } });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setHasReading(Array.isArray(data) && data.length > 0);
        } else {
          setHasReading(false);
        }
      } catch {
        if (mounted) setHasReading(false);
      }
    }
    checkReadings();
    return () => { mounted = false; };
  }, [isAuthed, token]);

  function handleLogout() {
    logout();
    history.push('/login');
  }

  return (
    <nav className="navbar">
      <NavLink exact to="/" className="brand" title="D-TRACK">
        {/* SVG logo mark */}
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2FF3E0" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#grad)" />
          <path d="M12 8h5.5c4 0 6.5 2.5 6.5 6s-2.5 6-6.5 6H12V8zm4.9 9.8c2.5 0 3.9-1.4 3.9-3.8s-1.4-3.8-3.9-3.8H15v7.6h1.9z" fill="#0a0a0a"/>
        </svg>
        <span className="sr-only">D-TRACK</span>
        <span className="brand-text">D-TRACK</span>
      </NavLink>
      <NavLink exact to="/" activeClassName="active">{t('home')}</NavLink>
      {!isAuthed && <NavLink to="/login" activeClassName="active">{t('login')}</NavLink>}
      {!isAuthed && <NavLink to="/signup" activeClassName="active">{t('signup')}</NavLink>}

      {isAuthed && (
        <>
          {/* Enforce onboarding order in nav: Profile -> Readings -> Education -> Dashboard */}
          <NavLink to="/profile" activeClassName="active">{t('profile')}</NavLink>
          {profileComplete && <NavLink to="/readings" activeClassName="active">{t('readings')}</NavLink>}
          {profileComplete && hasReading && <NavLink to="/education" activeClassName="active">Education</NavLink>}
          {profileComplete && hasReading && educationDone && (
            <NavLink to="/dashboard" activeClassName="active">{t('dashboard')}</NavLink>
          )}

          {/* Secondary links can appear after dashboard is unlocked to reduce distraction */}
          {profileComplete && hasReading && educationDone && (
            <>
              <NavLink to="/reminders" activeClassName="active">Reminders</NavLink>
              <NavLink to="/doctor-messages" activeClassName="active">Doctor Contact</NavLink>
              <NavLink to="/food-insights" activeClassName="active">Food Insights</NavLink>
              <NavLink to="/smart-alerts" activeClassName="active">Smart Alerts</NavLink>
              <NavLink to="/gamification" activeClassName="active">Progress</NavLink>
            </>
          )}
        </>
      )}
      <div className="spacer" />
      <button 
        onClick={toggleLanguage} 
        className="btn btn-outline"
        title={`Switch to ${language === 'en' ? 'Swahili' : 'English'}`}
      >
        {language === 'en' ? '🇰🇪 SW' : '🇺🇸 EN'}
      </button>
      {isAuthed && (
        <button onClick={handleLogout} className="btn btn-outline">{t('logout')}</button>
      )}
    </nav>
  );
}
