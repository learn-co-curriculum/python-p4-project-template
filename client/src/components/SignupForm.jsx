import React from 'react';
import '/.Login.css'

function SignupForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      email: 'user@example.com',
      password: 'securepassword',
      // other fields
    };

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        // Handle successful signup, such as redirecting to another page
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error.message);
      // Handle signup failure, show error message to the user, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Signup</button>
    </form>
  );
}

export default SignupForm;