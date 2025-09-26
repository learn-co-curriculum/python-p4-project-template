import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useHistory, NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short').required('Required'),
});

export default function Login() {
  const { setToken, setUser, setEducation, setAdvice } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div>
      <div className="crumb-wrap card" style={{ marginBottom: 16 }}>
        <div className="crumb">
          <span>Home</span>
          <span className="sep">›</span>
          <b>Login</b>
        </div>
        <div className="accent-line" />
      </div>

      <div className="card section" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>Welcome back</h2>
        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setError(null);
            setLoading(true);
            try {
              const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: values.email.trim(), password: values.password }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || 'Login failed');
              setToken(data.access_token);
              setUser(data.user);
              if (data.education) setEducation(data.education);
              if (data.advice) setAdvice(data.advice);
              history.push('/profile');
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

              <label>Password</label>
              <Field type="password" name="password" placeholder="••••••••" />
              <div className="error"><ErrorMessage name="password" /></div>

              <button type="submit" className="btn" disabled={loading || isSubmitting}>
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </Form>
          )}
        </Formik>
        <div style={{ marginTop: 12 }}>
          <small>
            <NavLink to="/forgot-password">Forgot password?</NavLink>
            <span style={{ margin: '0 6px' }}>|</span>
            Don&apos;t have an account? <NavLink to="/signup">Create one</NavLink>
          </small>
        </div>
      </div>
    </div>
  );
}