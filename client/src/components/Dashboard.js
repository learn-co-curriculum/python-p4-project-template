import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useLanguage } from './LanguageContext';

export default function Dashboard() {
  const { user, education, advice, token } = useAuth();
  const { language } = useLanguage();
  const [bmi, setBmi] = useState(null);
  const [bmiError, setBmiError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [dashError, setDashError] = useState(null);
  const [bmiHistory, setBmiHistory] = useState([]);
  const [bmiHistError, setBmiHistError] = useState(null);
  const [quickFood, setQuickFood] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  // Prepare chart data from dashboard recent readings
  const chartData = (dashboard?.recent_readings || []).slice().reverse().map((r, idx) => {
    const label = `${r.date?.slice(5)} ${r.time?.slice(0,5)}`; // MM-DD HH:MM
    return { idx, label, value: r.value };
  });

  // Prepare BMI chart data (reverse to chronological order)
  const bmiChartData = bmiHistory.slice().reverse().map((s, idx) => {
    const label = new Date(s.created_at).toLocaleDateString();
    return { idx, label, bmi: s.bmi };
  });

  useEffect(() => {
    async function loadBMI() {
      if (!user) return;
      if (!user.height_cm || !user.weight_kg) return; // needs profile data
      try {
        const res = await fetch('/me/bmi', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setBmi(data);
        else setBmiError(data.error || 'Could not load BMI');
      } catch (e) {
        setBmiError(e.message);
      }
    }

    async function loadBmiHistory() {
      if (!token) return;
      try {
        const res = await fetch('/bmi-history?limit=20', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setBmiHistory(data.history || []);
        else setBmiHistError(data.error || 'Could not load BMI history');
      } catch (e) {
        setBmiHistError(e.message);
      }
    }

    async function loadDoctor() {
      if (!user?.doctor_id) return;
      try {
        const res = await fetch('/doctors');
        if (res.ok) {
          const data = await res.json();
          const assignedDoctor = data.find(d => d.id === user.doctor_id);
          setDoctor(assignedDoctor);
        }
      } catch (e) {
        console.error('Failed to load doctor:', e);
      }
    }

    async function loadDashboard() {
      if (!token) return;
      try {
        const res = await fetch('/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setDashboard(data);
        else setDashError(data.error || 'Could not load dashboard');
      } catch (e) {
        setDashError(e.message);
      }
    }

    async function loadQuickFood() {
      if (!token) return;
      try {
        setInsightsLoading(true);
        const res = await fetch(`/educational-insights?lang=${language || 'en'}` , {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setQuickFood(data.food_recommendations || null);
        }
      } catch (e) {
        // silent fail for quick card
      } finally {
        setInsightsLoading(false);
      }
    }

    loadBMI();
    loadDoctor();
    loadDashboard();
    loadBmiHistory();
    loadQuickFood();
  }, [user, token, language]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>{language === 'sw' ? 'Nyumbani' : 'Home'}</span>
          <span className="sep">›</span>
          <b>{language === 'sw' ? 'Dashibodi' : 'Dashboard'}</b>
        </div>
        <div className="accent-line" />
      </div>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>Welcome, {user.name}</h3>
        <div className="grid-2">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Diabetes Type:</strong> {user.diabetes_type || 'Not set'}</div>
          <div>
            <strong>Doctor:</strong>{' '}
            {doctor ? (
              <span>{doctor.name} ({doctor.email}){doctor.phone ? ` · ${doctor.phone}` : ''}</span>
            ) : (
              <span>Not assigned</span>
            )}
          </div>
          <div><strong>Status:</strong> <span style={{ color: 'var(--cyan)' }}>Active Patient</span></div>
        </div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {doctor ? (
            <>
              {doctor.phone && <a className="btn" href={`tel:${doctor.phone}`}>Call Doctor</a>}
              <a className="btn btn-outline" href={`mailto:${doctor.email}`}>Email Doctor</a>
            </>
          ) : (
            <a className="btn btn-outline" href="/profile">Choose Doctor</a>
          )}
        </div>
      </section>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>{language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a className="btn" href="/doctor-messages">{language === 'sw' ? 'Zungumza na Daktari' : 'Talk to Doctor'}</a>
          <a className="btn btn-outline" href="/reminders">{language === 'sw' ? 'Vikumbusho Vijavyo' : 'Upcoming Reminders'}</a>
        </div>
      </section>

      {/* Low glucose quick help */}
      {dashboard?.latest_reading?.glucose_status === 'low' && (
        <section className="card section" style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ marginTop: 0 }}>
            {language === 'sw' ? 'Msaada wa Haraka: Sukari iko Chini' : 'Low Glucose Quick Help'}
          </h3>
          <ul>
            <li>{language === 'sw' ? 'Tumia gramu 15 za wanga wa haraka (juisi/glukosi/asali kidogo).' : 'Take 15g fast-acting carbs (juice/glucose/honey).'}
            </li>
            <li>{language === 'sw' ? 'Subiri dakika 15, pima tena.' : 'Wait 15 minutes, re-check.'}</li>
            <li>{language === 'sw' ? 'Rudia kama bado chini, kisha kula vitafunio vyenye protini/nyuzinyuzi.' : 'Repeat if still low, then have a protein/fiber snack.'}</li>
            <li>{language === 'sw' ? 'Epuka mazoezi makali hadi utulie.' : 'Avoid intense exercise until stable.'}</li>
          </ul>
        </section>
      )}

      {/* High glucose quick help */}
      {dashboard?.latest_reading?.glucose_status === 'high' && (
        <section className="card section" style={{ borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ marginTop: 0 }}>
            {language === 'sw' ? 'Msaada wa Haraka: Sukari iko Juu' : 'High Glucose Quick Help'}
          </h3>
          <ul>
            <li>{language === 'sw' ? 'Kunywa maji; epuka vinywaji vyenye sukari.' : 'Hydrate with water; avoid sugary drinks.'}</li>
            <li>{language === 'sw' ? 'Tembea kwa dakika 15–30 kama inawezekana.' : 'Take a 15–30 minute walk if safe.'}</li>
            <li>{language === 'sw' ? 'Chagua vyakula vyenye nyuzinyuzi na GI ya chini leo.' : 'Choose low-GI, high-fiber foods today.'}</li>
            <li>{language === 'sw' ? 'Fuata mpango wa dawa wa daktari wako.' : 'Follow your doctor’s medication plan.'}</li>
          </ul>
        </section>
      )}

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>
          {language === 'sw' ? 'Nini cha kula sasa' : 'What to eat now'}
        </h3>
        {insightsLoading && <p>Loading tips...</p>}
        {!insightsLoading && quickFood && (
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="grid-span-2" style={{ marginTop: -4, marginBottom: 8, opacity: 0.85 }}>
              <small>
                {language === 'sw'
                  ? `Imetokana na hali yako ya sasa (${quickFood.latest_status || '—'}) na BMI (${quickFood.bmi_category || '—'})` 
                  : `Based on your latest status (${quickFood.latest_status || '—'}) and BMI (${quickFood.bmi_category || '—'})`}
                {dashboard?.latest_reading && (
                  <>
                    {' '}
                    {language === 'sw' ? '· Kipimo' : '· Reading'} {dashboard.latest_reading.date?.slice(5)} {dashboard.latest_reading.time?.slice(0,5)}
                  </>
                )}
              </small>
            </div>
            <div className="grid-span-2" style={{ marginTop: -6 }}>
              <button className="btn btn-small btn-outline" onClick={() => setShowWhy(v => !v)}>
                {showWhy ? (language === 'sw' ? 'Ficha sababu' : 'Hide reasons') : (language === 'sw' ? 'Onyesha sababu' : 'Show reasons')}
              </button>
            </div>
            {quickFood.recommended && (
              <div>
                <h4 style={{ color: '#10b981', marginTop: 0 }}>
                  {language === 'sw' ? 'Inapendekezwa' : 'Recommended'}
                </h4>
                {showWhy && quickFood.recommended_detailed ? (
                  <ul>
                    {quickFood.recommended_detailed.map((it, i) => (
                      <li key={i}>
                        <div><strong>{it.item}</strong></div>
                        <div style={{ opacity: 0.85 }}>
                          {language === 'sw' ? it.reason_sw : it.reason_en}
                        </div>
                        {it.tags && it.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            {it.tags.map((t, j) => (
                              <span key={j} className="chip">{t}</span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    {quickFood.recommended.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
                {quickFood.tips && <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{quickFood.tips}</div>}
              </div>
            )}
            {quickFood.avoid && (
              <div>
                <h4 style={{ color: '#ef4444', marginTop: 0 }}>
                  {language === 'sw' ? 'Epuka' : 'Avoid'}
                </h4>
                {showWhy && quickFood.avoid_detailed ? (
                  <ul>
                    {quickFood.avoid_detailed.map((it, i) => (
                      <li key={i}>
                        <div><strong>{it.item}</strong></div>
                        <div style={{ opacity: 0.85 }}>
                          {language === 'sw' ? it.reason_sw : it.reason_en}
                        </div>
                        {it.tags && it.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            {it.tags.map((t, j) => (
                              <span key={j} className="chip chip-warn">{t}</span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul>
                    {quickFood.avoid.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {showWhy && (
              <div className="grid-span-2" style={{ opacity: 0.85 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {language === 'sw' ? 'Maelezo ya Lebo' : 'Tag Legend'}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="chip">low-GI</span>
                  <span className="chip">high-fiber</span>
                  <span className="chip">protein</span>
                  <span className="chip">whole-grain</span>
                  <span className="chip">healthy-fats</span>
                  <span className="chip chip-warn">refined-carb</span>
                  <span className="chip chip-warn">fried</span>
                  <span className="chip chip-warn">high-sugar</span>
                </div>
              </div>
            )}
          </div>
        )}
        {!insightsLoading && !quickFood && (
          <p>{language === 'sw' ? 'Ongeza kipimo kipya ili upate mwongozo wa chakula wa kibinafsi.' : 'Log a new reading to get personalized food guidance.'}</p>
        )}
      </section>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>BMI Trend</h3>
        {bmiHistError && <p style={{ color: 'crimson' }}>{bmiHistError}</p>}
        {bmiChartData.length > 1 ? (
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={bmiChartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 12 }} label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}`, 'BMI']} labelFormatter={(l) => l} />
                <Line type="monotone" dataKey="bmi" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>Insufficient BMI history. Update your height/weight to build a trend.</p>
        )}
      </section>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>{language === 'sw' ? 'Muhtasari' : 'Summary'}</h3>
        {dashError && <p style={{ color: 'crimson' }}>{dashError}</p>}
        {dashboard ? (
          <div className="grid-3">
            <div>
              <div><strong>{language === 'sw' ? 'Kipimo cha Hivi Karibuni' : 'Latest Reading'}</strong></div>
              <div>
                {dashboard.latest_reading ? (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>{dashboard.latest_reading.value} mg/dL</div>
                    <div style={{ opacity: 0.7 }}>{dashboard.latest_reading.context || 'random'}</div>
                  </>
                ) : (
                  <div>{language === 'sw' ? 'Bado hakuna vipimo' : 'No readings yet'}</div>
                )}
              </div>
            </div>
            <div>
              <div><strong>{language === 'sw' ? 'Wastani (siku 30)' : 'Average (30d)'}</strong></div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{dashboard.glucose_trend?.average ?? '—'}</div>
            </div>
            <div>
              <div><strong>BMI</strong></div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{dashboard.summary_cards?.bmi ?? '—'}</div>
              <div style={{ opacity: 0.7 }}>{dashboard.summary_cards?.bmi_category ?? ''}</div>
            </div>
          </div>
        ) : (
          <p>{language === 'sw' ? 'Inapakia muhtasari...' : 'Loading summary...'}</p>
        )}
      </section>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>Glucose Trend (last 30 readings)</h3>
        {dashboard?.recent_readings && dashboard.recent_readings.length > 0 ? (
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} interval={chartData.length > 12 ? Math.floor(chartData.length / 12) : 0} angle={-20} height={50} textAnchor="end" />
                <YAxis domain={[0, 'auto']} tick={{ fontSize: 12 }} label={{ value: 'mg/dL', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} mg/dL`, 'Glucose']} labelFormatter={(l) => `Reading @ ${l}`} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>No readings yet. Add some readings to see your trend.</p>
        )}
      </section>

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>BMI</h3>
        {!user.height_cm || !user.weight_kg ? (
          <p>Set your height and weight in the Profile page to see your BMI.</p>
        ) : bmi ? (
          <p><strong>{bmi.bmi}</strong> — {bmi.category}</p>
        ) : bmiError ? (
          <p style={{ color: 'crimson' }}>{bmiError}</p>
        ) : (
          <p>Loading BMI...</p>
        )}
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>{language === 'sw' ? 'Maarifa ya Kielimu' : 'Educational Insights'}</h3>
        {dashboard?.insights && dashboard.insights.length > 0 ? (
          <ul>
            {dashboard.insights.map((tip, i) => (
              <li key={i}><strong>{tip.title}:</strong> {tip.content}</li>
            ))}
          </ul>
        ) : education && education.length > 0 ? (
          <ul>
            {education.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>{language === 'sw' ? 'Sasisha aina ya kisukari kwenye wasifu wako ili upate maarifa maalum.' : 'Update your diabetes type in your profile to get tailored insights.'}</p>
        )}
      </section>

      {/* Latest tips snapshot */}
      {dashboard?.insights && dashboard.insights.length > 0 && (
        <section className="card section">
          <h3 style={{ marginTop: 0 }}>{language === 'sw' ? 'Vidokezo vya Hivi Karibuni' : 'Latest Tips'}</h3>
          <ul>
            {dashboard.insights.slice(0, 2).map((tip, i) => (
              <li key={i}><strong>{tip.title}:</strong> {tip.content}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card section">
        <h3 style={{ marginTop: 0 }}>Personalized Advice</h3>
        {advice?.bmi_category && (
          <p style={{ marginTop: 0 }}>
            <strong>BMI Category:</strong> {advice.bmi_category}
          </p>
        )}
        <div className="grid-2">
          <div>
            <h4>Nutrition</h4>
            <ul>
              {(advice?.nutrition || []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Exercise</h4>
            <ul>
              {(advice?.exercise || []).map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="section">
          <h4>Medication</h4>
          <ul>
            {(advice?.medication || []).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
