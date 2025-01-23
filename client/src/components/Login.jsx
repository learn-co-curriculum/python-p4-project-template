import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ userData, setUserData }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //redirect to / if already logged in
  if(userData.id !== null){
    navigate('/'); 
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();

    fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            setError(data.error)
        }
        else {
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email)
        localStorage.setItem('userId', data.id)
        

        const sessionUserData = {
          id: data.id,
          name: data.name,
          email: data.email
        }
        setUserData(sessionUserData)

        navigate('/');
        }
    })
    .catch(error => setError(error))
  };

  const handleRegisterRedirect = () => {
    navigate('/signup'); 
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
        <button type="button" onClick={handleRegisterRedirect}>
          Register Account
        </button>
      </form>
    </div>
  );
}

export default Login;