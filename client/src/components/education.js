import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';
import OnboardingStepper from './OnboardingStepper';

export default function Education() {
  const { language } = useLanguage();
  const history = useHistory();
  const { token } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);

  function completeAndGoDashboard() {
    try { localStorage.setItem('education_done', 'true'); } catch {}
    history.push('/dashboard');
  }

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/educational-insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load insights');
        setInsights(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    if (token) loadInsights();
  }, [token]);

  // Prefetch dashboard to warm charts and recent data
  useEffect(() => {
    let mounted = true;
    async function prefetchDashboard() {
      if (!token) return;
      try {
        await fetch('/dashboard', { headers: { Authorization: `Bearer ${token}` } });
      } catch {}
    }
    prefetchDashboard();
    return () => { mounted = false; };
  }, [token]);

  const modules = {
    basics: {
      title: { en: 'Diabetes Basics', sw: 'Misingi ya Kisukari' },
      icon: '🩺',
      content: {
        en: [
          'Diabetes affects over 458,000 Kenyans.',
          'Your body cannot properly use sugar from food.',
          'With proper care, you can live a healthy life.'
        ],
        sw: [
          'Kisukari kinaathiri Wakenya zaidi ya 458,000.',
          'Mwili wako hauwezi kutumia sukari kutoka chakula vizuri.',
          'Kwa utunzaji mzuri, unaweza kuishi maisha mazuri.'
        ]
      },
      quiz: {
        question: { en: 'How many Kenyans have diabetes?', sw: 'Wakenya wangapi wana kisukari?' },
        options: { en: ['Over 458,000', '100,000', '50,000'], sw: ['Zaidi ya 458,000', '100,000', '50,000'] },
        correct: 0
      }
    },
    foods: {
      title: { en: 'Kenyan Foods', sw: 'Vyakula vya Kikenya' },
      icon: '🥗',
      content: {
        en: [
          'Sukuma wiki is excellent for diabetes.',
          'Limit ugali and chapati portions.',
          'Avoid mandazi and fried foods.'
        ],
        sw: [
          'Sukuma wiki ni bora kwa kisukari.',
          'Punguza vipimo vya ugali na chapati.',
          'Epuka mandazi na vyakula vya kukaanga.'
        ]
      },
      quiz: {
        question: { en: 'Which is best for diabetes?', sw: 'Ni kipi bora kwa kisukari?' },
        options: { en: ['Sukuma wiki', 'Mandazi', 'White ugali'], sw: ['Sukuma wiki', 'Mandazi', 'Ugali mweupe'] },
        correct: 0
      }
    }
  };

  const handleQuiz = (moduleId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [moduleId]: answer }));
  };

  return (
    <div>
      <OnboardingStepper currentStep="education" />
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>{language === 'sw' ? 'Elimu' : 'Education'}</b>
        </div>
        <div className="accent-line" />
      </div>

      {/* Dynamic Insights Section */}
      <div className="card section">
        <h2 style={{ marginTop: 0 }}>{language === 'sw' ? 'Maarifa ya Kibinafsi' : 'Personalized Insights'}</h2>
        {loading && <p>{language === 'sw' ? 'Inapakia...' : 'Loading...'}</p>}
        {error && <p className="error">{error}</p>}
        {!loading && insights && (
          <div className="grid-3" style={{ gap: 16 }}>
            {/* What to do when glucose is high */}
            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div style={{ padding: 12 }}>
                <h3 style={{ marginTop: 0 }}>
                  {language === 'sw' ? 'Nini cha kufanya sukari ikiwa juu' : 'What to do when glucose is high'}
                </h3>
                <ul>
                  <li>{language === 'sw' ? 'Kunywa maji; epuka vinywaji vyenye sukari.' : 'Hydrate with water; avoid sugary drinks.'}</li>
                  <li>{language === 'sw' ? 'Tembea kwa dakika 15–30 kama ni salama.' : 'Take a 15–30 minute walk if safe.'}</li>
                  <li>{language === 'sw' ? 'Chagua vyakula vyenye nyuzinyuzi na GI ya chini.' : 'Choose low-GI, high-fiber foods today.'}</li>
                  <li>{language === 'sw' ? 'Fuata mpango wa dawa uliokubaliwa na daktari.' : 'Follow your doctor’s medication plan.'}</li>
                </ul>
                {insights.latest_status === 'high' && insights.insights?.length > 0 && (
                  <div style={{ opacity: 0.85 }}>
                    <strong>{language === 'sw' ? 'Vidokezo:' : 'Tips:'}</strong>
                    <ul>
                      {insights.insights.slice(0,3).map((tip, i) => (
                        <li key={i}>{tip.title}: {tip.content}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* What to do when glucose is low */}
            {insights.latest_status === 'low' && (
              <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                <div style={{ padding: 12 }}>
                  <h3 style={{ marginTop: 0 }}>
                    {language === 'sw' ? 'Nini cha kufanya sukari ikiwa chini' : 'What to do when glucose is low'}
                  </h3>
                  <ul>
                    <li>{language === 'sw' ? 'Tumia gramu 15 za wanga wa haraka (juisi, glukosi, asali kidogo).' : 'Take 15g fast-acting carbs (juice, glucose tabs, a little honey).'}</li>
                    <li>{language === 'sw' ? 'Subiri dakika 15, pima tena.' : 'Wait 15 minutes, re-check glucose.'}</li>
                    <li>{language === 'sw' ? 'Rudia kama bado chini; kisha kula vitafunio vyenye protini/nyuzinyuzi.' : 'Repeat if still low; then have a protein/fiber snack.'}</li>
                    <li>{language === 'sw' ? 'Epuka mazoezi makali hadi usalama urejee.' : 'Avoid intense exercise until stable.'}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Maintain normal glucose */}
            {(insights.latest_status === 'normal' || !insights.latest_status) && (
              <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ padding: 12 }}>
                  <h3 style={{ marginTop: 0 }}>
                    {language === 'sw' ? 'Dumisha sukari ya kawaida' : 'Maintain normal glucose'}
                  </h3>
                  <ul>
                    <li>{language === 'sw' ? 'Kula milo iliyo sawa: mboga zisizo na wanga, protini konda, mafuta mazuri.' : 'Balanced meals: non-starchy veggies, lean proteins, healthy fats.'}</li>
                    <li>{language === 'sw' ? 'Tembea mara kwa mara na kunywa maji ya kutosha.' : 'Regular walks and adequate hydration.'}</li>
                    <li>{language === 'sw' ? 'Panga vipimo vyako vya kawaida.' : 'Keep regular glucose checks.'}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Foods to eat today (Kenyan-focused) */}
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ padding: 12 }}>
                <h3 style={{ marginTop: 0 }}>
                  {language === 'sw' ? 'Vyakula vya kula leo' : 'Foods to eat today'}
                </h3>
                {insights.food_recommendations ? (
                  <>
                    {insights.food_recommendations.recommended && (
                      <>
                        <strong>{language === 'sw' ? 'Inapendekezwa' : 'Recommended'}</strong>
                        <ul>
                          {insights.food_recommendations.recommended.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {insights.food_recommendations.avoid && (
                      <>
                        <strong>{language === 'sw' ? 'Epuka' : 'Avoid'}</strong>
                        <ul>
                          {insights.food_recommendations.avoid.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {insights.food_recommendations.tips && (
                      <div style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                        {insights.food_recommendations.tips}
                      </div>
                    )}
                    <div style={{ marginTop: 8, fontSize: '0.9rem' }}>
                      {language === 'sw' ? 'Dokezo la eneo: badili chapati na mchele wa kahawia; furahia sukuma wiki, ndengu, terere, na ugali wa mtama.' : 'Local tip: swap chapati for brown rice; enjoy sukuma wiki, ndengu, terere, and millet ugali.'}
                    </div>
                  </>
                ) : (
                  <p>{language === 'sw' ? 'Sasisha wasifu wako na ongeza kipimo ili upate mapendekezo ya chakula.' : 'Update your profile and add a reading to get food suggestions.'}</p>
                )}
              </div>
            </div>

            {/* Exercise tips */}
            <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ padding: 12 }}>
                <h3 style={{ marginTop: 0 }}>
                  {language === 'sw' ? 'Vidokezo vya mazoezi' : 'Exercise tips'}
                </h3>
                <ul>
                  <li>{language === 'sw' ? 'Tembea kwa kasi dakika 20–30 kila siku.' : 'Take brisk 20–30 minute walks daily.'}</li>
                  <li>{language === 'sw' ? 'Fanya mazoezi mepesi ya mwili (bodyweight).' : 'Incorporate light bodyweight exercises.'}</li>
                  <li>{language === 'sw' ? 'Baada ya chakula, tembea dakika 10–15.' : 'After meals, do a 10–15 minute stroll.'}</li>
                  <li>{language === 'sw' ? 'Uendelevu ni muhimu; hatua ndogo zina maana.' : 'Stay consistent; small steps matter.'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {!selectedModule ? (
        <div>
          <div className="card section">
            <h2 style={{ marginTop: 0 }}>
              {language === 'sw' ? 'Chagua Mada' : 'Choose Topic'}
            </h2>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-outline" onClick={completeAndGoDashboard}>
                {language === 'sw' ? 'Ruka hadi Dashibodi' : 'Skip to Dashboard'}
              </button>
            </div>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            {Object.entries(modules).map(([id, module]) => (
              <div key={id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedModule(id)}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem' }}>{module.icon}</div>
                  <h3>{module.title[language]}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="card section">
            <button className="btn btn-outline" onClick={() => setSelectedModule(null)}>
              ← {language === 'sw' ? 'Rudi' : 'Back'}
            </button>
            <h2>{modules[selectedModule].title[language]}</h2>
            
            {modules[selectedModule].content[language].map((text, i) => (
              <p key={i}>{text}</p>
            ))}

            <div style={{ backgroundColor: 'rgba(47, 243, 224, 0.1)', padding: 16, borderRadius: 8 }}>
              <h4>{language === 'sw' ? 'Jaribio' : 'Quiz'}</h4>
              <p><strong>{modules[selectedModule].quiz.question[language]}</strong></p>
              {modules[selectedModule].quiz.options[language].map((option, i) => (
                <button
                  key={i}
                  className="btn btn-outline"
                  style={{ 
                    display: 'block', 
                    width: '100%', 
                    marginBottom: 8,
                    backgroundColor: quizAnswers[selectedModule] === i ? 
                      (i === modules[selectedModule].quiz.correct ? '#10b981' : '#ef4444') : 'transparent'
                  }}
                  onClick={() => handleQuiz(selectedModule, i)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={completeAndGoDashboard}>
                {language === 'sw' ? 'Inayofuata: Dashibodi' : 'Next: Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
