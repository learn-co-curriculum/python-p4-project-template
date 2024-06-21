import React from 'react';
import '../styles/Register.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Define a validation schema using Yup
const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

// Define the onSubmit function
const onSubmit = async (values, actions) => {
  try {
    const response = await fetch('http://localhost:5555/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Success:', data);

    // Reset the form after a successful submission
    actions.resetForm();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    actions.setSubmitting(false);
  }
};

const Register = () => {
  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className='register-form-container'>
      <h1 className='register-form-title'>Register</h1>
      <label className='register-form-label'>
        Username:
        <input
          className={`register-form-input ${errors.username && touched.username ? 'input-error' : ''}`}
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.username && touched.username && (<p className="error">{errors.username}</p>)}
      </label>
      <br />
      <label className='register-form-label'>
        Email:
        <input
          className={`register-form-input ${errors.email && touched.email ? 'input-error' : ''}`}
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && touched.email && (<p className="error">{errors.email}</p>)}
      </label>
      <br />
      <label className='register-form-label'>
        Password:
        <input
          className={`register-form-input ${errors.password && touched.password ? 'input-error' : ''}`}
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && touched.password && (<p className="error">{errors.password}</p>)}
      </label>
      <br />
      <button className='register-form-button' type="submit" disabled={isSubmitting}>Register</button>
    </form>
  );
};

export default Register;
