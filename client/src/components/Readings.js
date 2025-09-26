import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import OnboardingStepper from './OnboardingStepper';

const ReadingSchema = Yup.object({
  value: Yup.number().min(40).max(500).required('Required'),
  date: Yup.string().required('Required'), 
  time: Yup.string().required('Required'),
  context: Yup.string().oneOf(['', 'pre_meal', 'post_meal']),
  notes: Yup.string(),
});

function evaluateGlucose(value, context) {
  if (context === 'pre_meal') {
    if (value < 80) return { status: 'low', color: 'goldenrod' };
    if (value <= 130) return { status: 'normal', color: 'green' };
    return { status: 'high', color: 'crimson' };
  }
  // post_meal or unknown
  if (value < 180) return { status: 'normal', color: 'green' };
  return { status: 'high', color: 'crimson' };
}


const TIPS_NORMAL = [
  'Maintain balanced meals with non-starchy veggies, lean protein, and healthy fats.',
  'Stay hydrated and keep up light daily activity.',
  'Aim for consistent meal times and portion control.',
];
const TIPS_HIGH = [
  'Take a 15–30 minute walk and hydrate with water.',
  'Reduce refined carbohydrates; choose low-GI, high-fiber foods.',
  'Include lean proteins and healthy fats to slow glucose spikes.',
  'Discuss supplements with your doctor (e.g., cinnamon, berberine).',
];

function suggestionsFor(value, context) {
  const { status } = evaluateGlucose(value, context);
  if (status === 'normal') return TIPS_NORMAL;
  if (status === 'high') return TIPS_HIGH;
  return [];
}

export default function Readings() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [setReminder, setSetReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const history = useHistory();

  const fetchReadings = useCallback(async () => {
    try {
      const res = await fetch('/readings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load');
      setItems(data);
    } catch (e) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => { fetchReadings(); }, [fetchReadings]);

  // Prefetch educational insights to warm up Education screen
  useEffect(() => {
    let mounted = true;
    async function prefetchEducation() {
      if (!token) return;
      try {
        await fetch('/educational-insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    prefetchEducation();
    return () => { mounted = false; };
  }, [token]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this reading?')) return;
    try {
      const res = await fetch(`/readings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      setItems(items.filter(r => r.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleCreate(values, { setSubmitting, resetForm, setStatus }) {
    setStatus(null);
    try {
      const res = await fetch('/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Create failed');
      setItems(prev => [...prev, data]);
      resetForm();

      // Optional: create a reminder and navigate to Education
      if (setReminder) {
        try {
          await fetch('/reminders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              reminder_type: 'glucose',
              title: 'Next glucose check',
              message: 'Time to measure your blood sugar',
              scheduled_time: reminderTime,
              frequency: 'daily',
            }),
          });
        } catch {}
      }
      history.push('/education');
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <OnboardingStepper currentStep="readings" />
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Readings</b>
        </div>
        <div className="accent-line" />
      </div>

      <div className="card section">
        <h2 style={{ marginTop: 0 }}>Add Reading</h2>
        <Formik
          initialValues={{ value: '', date: '', time: '', context: '', notes: '' }}
          validationSchema={ReadingSchema}
          onSubmit={handleCreate}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y">
              <label>Value (mg/dL)</label>
              <Field name="value" type="number" step="1" />
              <div className="error"><ErrorMessage name="value" /></div>

              <label>Date</label>
              <Field name="date" type="date" />
              <div className="error"><ErrorMessage name="date" /></div>

              <label>Time</label>
              <Field name="time" type="time" />
              <div className="error"><ErrorMessage name="time" /></div>

              <label>Context (optional)</label>
              <Field as="select" name="context">
                <option value="">Select</option>
                <option value="pre_meal">Pre-meal</option>
                <option value="post_meal">Post-meal</option>
              </Field>
              <div className="error"><ErrorMessage name="context" /></div>

              <label>Notes (optional)</label>
          <Field name="notes" as="textarea" rows={2} />

          {status && <div className="error">{status}</div>}
          <div className="card section" style={{ marginTop: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={setReminder} onChange={(e) => setSetReminder(e.target.checked)} />
              Set reminder for next reading
            </label>
            {setReminder && (
              <div style={{ marginTop: 8 }}>
                <label>Reminder Time</label>
                <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn" type="submit" disabled={isSubmitting}>Add Reading</button>
            <button className="btn btn-outline" type="button" onClick={() => history.push('/education')}>Skip & Continue</button>
          </div>
        </Form>
      )}
        </Formik>
      </div>

      {error && <div className="error card" style={{ padding: 12, marginBottom: 12 }}>{error}</div>}

      <ul className="list">
        {items.map(r => {
          const { status, color } = evaluateGlucose(r.value, r.context);
          const tips = (r.evaluation && r.evaluation.suggestions) ? r.evaluation.suggestions : suggestionsFor(r.value, r.context);
          return (
            <li key={r.id} className="list-item" style={{ borderLeft: `6px solid ${color}` }}>
              <div><strong>{r.date}</strong> {r.time?.slice(0,5)} — {r.context || 'n/a'}</div>
              <div>Value: <strong style={{ color }}>{r.value}</strong> ({status})</div>
              {r.notes && <div>Notes: {r.notes}</div>}
              {tips.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontWeight: 600 }}>Suggestions</div>
                  <ul>
                    {tips.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="btn btn-outline" onClick={() => handleDelete(r.id)} style={{ marginTop: 6 }}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
