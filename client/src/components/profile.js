import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import OnboardingStepper from './OnboardingStepper';

const TYPES = [
  { value: '', label: 'Select (optional)' },
  { value: 'type1', label: 'Type 1' },
  { value: 'type2', label: 'Type 2' },
  { value: 'gestational', label: 'Gestational' },
  { value: 'prediabetes', label: 'Prediabetes' },
];

const ProfileSchema = Yup.object({
  diabetes_type: Yup.string().oneOf(['', 'type1', 'type2', 'gestational', 'prediabetes']),
  height_cm: Yup.number().nullable().min(50, 'Too short').max(250, 'Too tall'),
  weight_kg: Yup.number().nullable().min(20, 'Too low').max(400, 'Too high'),
  age: Yup.number().nullable().min(1).max(120),
  gender: Yup.string().oneOf(['', 'male', 'female', 'other']),
  emergency_contact_phone: Yup.string().nullable(),
  emergency_contact_name: Yup.string().nullable(),
  last_hospital_visit: Yup.string().nullable(),
  doctor_id: Yup.number().nullable(),
});

export default function Profile() {
  const { token, user, setUser, setEducation, setAdvice } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const history = useHistory();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await fetch('/doctors');
        if (!res.ok) return;
        const data = await res.json();
        setDoctors(data);
      } catch {}
    }
    loadDoctors();
  }, []);

  if (!user) return null;

  async function handleSubmit(values, { setSubmitting, setStatus }) {
    setStatus(null);
    try {
      // First update base profile fields on /me
      const res = await fetch('/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diabetes_type: values.diabetes_type || null,
          height_cm: values.height_cm === '' ? null : values.height_cm,
          weight_kg: values.weight_kg === '' ? null : values.weight_kg,
          doctor_id: values.doctor_id === '' ? null : values.doctor_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      const { education, advice, ...userDataBase } = data;

      // Then update extended fields on /profile/enhanced
      const enhancedRes = await fetch('/profile/enhanced', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: values.age === '' ? null : values.age,
          gender: values.gender || null,
          height_cm: values.height_cm === '' ? null : values.height_cm,
          weight_kg: values.weight_kg === '' ? null : values.weight_kg,
          emergency_contact_name: values.emergency_contact_name || null,
          emergency_contact_phone: values.emergency_contact_phone || null,
          last_hospital_visit: values.last_hospital_visit || null,
        }),
      });
      const enhancedData = await enhancedRes.json();
      if (!enhancedRes.ok) throw new Error(enhancedData.error || 'Enhanced update failed');

      const finalUser = enhancedData.user || userDataBase;
      setUser(finalUser);
      if (education) setEducation(education);
      if (advice) setAdvice(advice);
      setStatus('Saved!');
      // Onboarding: move to readings entry
      history.push('/readings');
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <OnboardingStepper currentStep="profile" />
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Profile</b>
        </div>
        <div className="accent-line" />
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Profile</h2>
        <Formik
          initialValues={{
            diabetes_type: user.diabetes_type || '',
            height_cm: user.height_cm ?? '',
            weight_kg: user.weight_kg ?? '',
            doctor_id: user.doctor_id ?? '',
            age: user.age ?? '',
            gender: user.gender ?? '',
            emergency_contact_name: user.emergency_contact_name ?? '',
            emergency_contact_phone: user.emergency_contact_phone ?? '',
            last_hospital_visit: user.last_hospital_visit ? user.last_hospital_visit.slice(0,10) : '',
          }}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y">
              <label>Diabetes Type</label>
              <Field as="select" name="diabetes_type">
                {TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Field>
              <div className="error"><ErrorMessage name="diabetes_type" /></div>

              <label>Doctor</label>
              <Field as="select" name="doctor_id">
                <option value="">Unassigned</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                ))}
              </Field>

              <label>Height (cm)</label>
              <Field name="height_cm" type="number" step="0.1" />
              <div className="error"><ErrorMessage name="height_cm" /></div>

              <label>Weight (kg)</label>
              <Field name="weight_kg" type="number" step="0.1" />
              <div className="error"><ErrorMessage name="weight_kg" /></div>

              <div className="grid-2" style={{ gap: 12 }}>
                <label>
                  Age
                  <Field name="age" type="number" />
                </label>
                <label>
                  Gender
                  <Field as="select" name="gender">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                </label>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <label>
                  Emergency Contact Name
                  <Field name="emergency_contact_name" />
                </label>
                <label>
                  Emergency Contact Phone
                  <Field name="emergency_contact_phone" />
                </label>
              </div>

              <label>Last Hospital Visit</label>
              <Field name="last_hospital_visit" type="date" />

              {status && <div className={status === 'Saved!' ? 'success' : 'error'}>{status}</div>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" type="submit" disabled={isSubmitting}>Save</button>
                <button type="button" className="btn btn-outline" onClick={() => history.push('/readings')}>Save & Continue</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
 // <-- This closes the Profile function