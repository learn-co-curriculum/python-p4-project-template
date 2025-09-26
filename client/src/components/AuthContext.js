import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [education, setEducation] = useState(() => {
    const raw = localStorage.getItem('education');
    return raw ? JSON.parse(raw) : [];
  });
  const [advice, setAdvice] = useState(() => {
    const raw = localStorage.getItem('advice');
    return raw ? JSON.parse(raw) : { nutrition: [], exercise: [], medication: [], bmi_category: null };
  });
  const isAuthed = Boolean(token && user);

  // Persist to localStorage
  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);
  useEffect(() => {
    if (education) localStorage.setItem('education', JSON.stringify(education)); else localStorage.removeItem('education');
  }, [education]);
  useEffect(() => {
    if (advice) localStorage.setItem('advice', JSON.stringify(advice)); else localStorage.removeItem('advice');
  }, [advice]);

  // Try to restore session
  useEffect(() => {
    async function restore() {
      if (!token) return;
      try {
        const res = await fetch('/check_session', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // data may include { ...userFields, education: [...], advice: {...} }
          const { education: edu, advice: adv, ...userData } = data || {};
          setUser(userData || null);
          if (edu) setEducation(edu);
          if (adv) setAdvice(adv);
        } else {
          // token invalid
          setToken(null);
          setUser(null);
          setEducation([]);
          setAdvice({ nutrition: [], exercise: [], medication: [], bmi_category: null });
        }
      } catch (e) {
        console.error(e);
      }
    }
    restore();
  }, []); // run once

  const value = {
    token,
    user,
    education,
    advice,
    isAuthed,
    setToken,
    setUser,
    setEducation,
    setAdvice,
    logout: () => {
      setToken(null);
      setUser(null);
      setEducation([]);
      setAdvice({ nutrition: [], exercise: [], medication: [], bmi_category: null });
      localStorage.clear();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
