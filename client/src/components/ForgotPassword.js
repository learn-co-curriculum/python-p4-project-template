import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ForgotSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Forgot Password</b>
        </div>
        <div className="accent-line" />
      </div>

      <div className="card section" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Reset your password</h2>
        <p>Enter your account email. If it exists, you'll receive a reset link.</p>
        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
        {message && <div className="success" style={{ marginBottom: 12 }}>{message}</div>}
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            setMessage(null);
            setLoading(true);
            try {
              const res = await fetch('/password/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email.trim() })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Request failed');
              setMessage(data.message || 'If the email exists, a reset link has been sent.');
            } catch (e) {
              setError(e.message);
            } finally {
              setLoading(false);
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y">
              <label>Email</label>
              <Field type="email" name="email" placeholder="you@example.com" />
              <div className="error"><ErrorMessage name="email" /></div>
              <button className="btn" type="submit" disabled={loading || isSubmitting}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </Form>
          )}
        </Formik>
        <div style={{ marginTop: 12 }}>
          <small>
            <NavLink to="/login">Back to Login</NavLink>
          </small>
        </div>
      </div>
    </div>
  );
}
