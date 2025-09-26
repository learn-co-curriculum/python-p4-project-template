import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Enforce onboarding steps before accessing a route.
 * Props:
 * - requireProfile: boolean
 * - requireReading: boolean
 * - requireEducation: boolean
 */
export default function OnboardingGuard({ requireProfile, requireReading, requireEducation, children }) {
  const { user, token } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [hasReading, setHasReading] = useState(null);

  const profileComplete = Boolean(user?.height_cm && user?.weight_kg);
  const educationDone = localStorage.getItem('education_done') === 'true';

  useEffect(() => {
    let isMounted = true;

    async function checkReadings() {
      if (!requireReading) return setHasReading(true);
      if (!token) return setHasReading(false);
      try {
        setLoading(true);
        const res = await fetch('/readings', { headers: { Authorization: `Bearer ${token}` } });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setHasReading(Array.isArray(data) && data.length > 0);
        } else {
          setHasReading(false);
        }
      } catch {
        if (isMounted) setHasReading(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkReadings();
    return () => { isMounted = false; };
  }, [token, requireReading]);

  useEffect(() => {
    if (loading) return;

    // Redirect logic order: Profile -> Readings -> Education -> Dashboard
    if (requireProfile && !profileComplete) {
      if (location.pathname !== '/profile') history.replace('/profile');
      return;
    }
    if (requireReading && hasReading === false) {
      if (location.pathname !== '/readings') history.replace('/readings');
      return;
    }
    if (requireEducation && !educationDone) {
      if (location.pathname !== '/education') history.replace('/education');
      return;
    }
  }, [loading, profileComplete, hasReading, educationDone, requireProfile, requireReading, requireEducation, history, location.pathname]);

  if (loading || (requireReading && hasReading === null)) {
    return <div className="card">Checking onboarding...</div>;
  }

  return <>{children}</>;
}
