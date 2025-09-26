import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function DoctorMessages() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [text, setText] = useState(''); // kept for backward compatibility (not strictly needed)
  const [isEmergency, setIsEmergency] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [latest, setLatest] = useState(null);

  async function loadMessages() {
    setError(null);
    try {
      const res = await fetch('/doctor-messages', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
      else setError(data.error || 'Failed to load messages');
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { loadMessages(); }, [token]);

  useEffect(() => {
    async function loadDoctor() {
      if (!user?.doctor_id) { setDoctor(null); return; }
      try {
        const res = await fetch(`/doctors/${user.doctor_id}/patients`);
        const data = await res.json();
        if (res.ok) setDoctor(data.doctor);
      } catch {}
    }
    loadDoctor();
  }, [user]);

  // Load latest reading (via dashboard) to suggest emergency call if low
  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await fetch('/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setLatest(data.latest_reading || null);
      } catch {}
    }
    if (token) loadLatest();
  }, [token]);

  const MessageSchema = Yup.object({
    message: Yup.string().required('Required').min(3, 'Too short').max(500, 'Too long'),
    is_emergency: Yup.boolean(),
  });

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Doctor Contact</b>
          {doctor && (
            <span style={{ marginLeft: 8, opacity: 0.8 }}>— {doctor.name}</span>
          )}
        </div>
        <div className="accent-line" />
      </div>

      {/* Emergency suggestion if latest reading is low */}
      {latest?.glucose_status === 'low' && doctor && (
        <div className="card section" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <strong>Recent low glucose detected.</strong> If you feel unwell, follow the low-glucose steps and contact your doctor.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {doctor.phone && <a className="btn" href={`tel:${doctor.phone}`}>Call {doctor.name.split(' ')[0]}</a>}
              <a className="btn btn-outline" href={`mailto:${doctor.email}`}>Email</a>
            </div>
          </div>
        </div>
      )}

      {error && <div className="card section" style={{ color: 'crimson' }}>{error}</div>}

      <div className="card section">
        <h3 style={{ marginTop: 0 }}>Assigned Doctor</h3>
        {!user?.doctor_id ? (
          <div>
            <p>No doctor assigned yet.</p>
            <NavLink className="btn btn-outline" to="/profile">Choose a doctor</NavLink>
          </div>
        ) : doctor ? (
          <div className="grid-2" style={{ gap: 12 }}>
            <div>
              <div><strong>{doctor.name}</strong></div>
              <div>{doctor.email}</div>
              {doctor.phone && <div>{doctor.phone}</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {doctor.phone && <a className="btn" href={`tel:${doctor.phone}`}>Call</a>}
              <a className="btn btn-outline" href={`mailto:${doctor.email}`}>Email</a>
            </div>
          </div>
        ) : (
          <p>Loading doctor...</p>
        )}
      </div>

      <div className="card section">
        <h3 style={{ marginTop: 0 }}>New Message</h3>
        <Formik
          initialValues={{ message: '', is_emergency: false }}
          validationSchema={MessageSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError(null);
            try {
              const res = await fetch('/doctor-messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: values.message.trim(), is_emergency: values.is_emergency })
              });
              if (res.ok) {
                resetForm();
                setText('');
                setIsEmergency(false);
                loadMessages();
              } else {
                const data = await res.json();
                setError(data.error || 'Failed to send message');
              }
            } catch (e) {
              setError(e.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="grid-2" style={{ gap: 12 }}>
              <label className="grid-span-2">
                <span>Message</span>
                <Field as="textarea" rows={3} name="message" placeholder="Type your message to the doctor" />
                <div className="error"><ErrorMessage name="message" /></div>
              </label>
              <label>
                <Field type="checkbox" name="is_emergency" /> Emergency
              </label>
              <div className="grid-span-2">
                <button type="submit" className="btn" disabled={isSubmitting}>Send</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="card section">
        <h3 style={{ marginTop: 0 }}>Recent Messages</h3>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {messages.map(m => (
              <li key={m.id} style={{ marginBottom: 8 }}>
                <div>
                  <strong>{m.sender_type === 'user' ? 'You' : 'Doctor'}</strong>
                  {m.is_emergency && <span style={{ marginLeft: 8, color: 'crimson' }}>EMERGENCY</span>}
                  <span style={{ marginLeft: 8, opacity: 0.7 }}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div>{m.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
