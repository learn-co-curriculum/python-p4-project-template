import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

export default function Reminders() {
  const { token } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    reminder_type: 'glucose',
    title: '',
    message: '',
    scheduled_time: '08:00',
    frequency: 'daily',
  });

  const loadReminders = useCallback(async () => {
    try {
      const res = await fetch('/reminders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setReminders(data.reminders || []);
      else setError(data.error || 'Failed to load reminders');
    } catch (e) {
      setError(e.message);
    }
  }, [token]);

  useEffect(() => { loadReminders(); }, [loadReminders]);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ reminder_type: 'glucose', title: '', message: '', scheduled_time: '08:00', frequency: 'daily' });
        loadReminders();
      } else {
        setError(data.error || 'Failed to create reminder');
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleActive(id, current) {
    try {
      const res = await fetch(`/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: !current }),
      });
      if (res.ok) loadReminders();
    } catch {}
  }

  async function removeReminder(id) {
    try {
      const res = await fetch(`/reminders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) loadReminders();
    } catch {}
  }

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Reminders</b>
        </div>
        <div className="accent-line" />
      </div>

      <div className="card section">
        <h3 style={{ marginTop: 0 }}>Create Reminder</h3>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <form onSubmit={handleCreate} className="grid-2" style={{ gap: 12 }}>
          <label>
            Type
            <select value={form.reminder_type} onChange={e => setForm({ ...form, reminder_type: e.target.value })}>
              <option value="glucose">Glucose</option>
              <option value="hospital">Hospital</option>
              <option value="medication">Medication</option>
            </select>
          </label>
          <label>
            Time
            <input type="time" value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
          </label>
          <label>
            Frequency
            <select value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="grid-span-2">
            Title
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Morning glucose check" />
          </label>
          <label className="grid-span-2">
            Message (optional)
            <input value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Optional note" />
          </label>
          <div className="grid-span-2">
            <button type="submit" className="btn">Create</button>
          </div>
        </form>
      </div>

      <div className="card section">
        <h3 style={{ marginTop: 0 }}>Your Reminders</h3>
        {reminders.length === 0 ? (
          <p>No reminders yet.</p>
        ) : (
          <ul>
            {reminders.map(r => (
              <li key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div><strong>{r.title}</strong> <span style={{ opacity: 0.7 }}>({r.reminder_type}, {r.frequency})</span></div>
                  <div style={{ opacity: 0.7 }}>At {r.scheduled_time?.slice(0,5)} — {r.message || 'No message'}</div>
                </div>
                <button className="btn btn-outline" onClick={() => toggleActive(r.id, r.is_active)}>
                  {r.is_active ? 'Disable' : 'Enable'}
                </button>
                <button className="btn btn-outline" onClick={() => removeReminder(r.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
