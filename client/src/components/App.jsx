import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'

import Login from './Login.jsx'
import Logout from './Logout.jsx';
import Register from './Register.jsx'
import Account from './Account.jsx'
import LoggedInContainer from './LoggedInContainer.jsx'
import RoutineContainer from './RoutineContainer.jsx';
import EditRoutineForm from './EditRoutineForm.jsx';
import ExerciseContainer from './ExerciseContainer.jsx'
import RedirectToIndex from './RedirectToIndex.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/theme.css';
import HeaderImage from '/header.png'

function App() {
  const navigate = useNavigate();
  
  // state to track whether the user is authenticated
  const defaultUserData = {id: null, name: null, email: null}
  const [userData, setUserData] = useState(defaultUserData)

  const handleLogout = () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      setUserData(defaultUserData)
  }

  useEffect(() => {
    const sessionUserData = {
      id: localStorage.getItem('userId'),
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail')
    }
    //console.log(sessionUserData)
    
    if (sessionUserData.id == null || sessionUserData.id == "undefined") {
      navigate('/login');
    } else {
      setUserData(sessionUserData)
    }
  }, []);

  return (
    <> 
     <img src={HeaderImage} alt="Header" style={{ width: '100%', height: 'auto' }} />
     <Routes>
        <Route index element={<LoggedInContainer userData={userData}><RoutineContainer /></LoggedInContainer>} />
        <Route path="/account" element={<LoggedInContainer userData={userData}><Account /></LoggedInContainer>} />
        <Route path="/edit-routine/:id" element={<LoggedInContainer userData={userData}><EditRoutineForm /></LoggedInContainer>} />
        <Route path="/exercises" element={<LoggedInContainer userData={userData}><ExerciseContainer userData={userData}/></LoggedInContainer>} />
        <Route path="/login" element={<Login userData={userData} setUserData={setUserData} />} />
        <Route path="/logout" element={<Logout handleLogout={handleLogout} />} />
        <Route path="/signup" element={<Register />} />
        <Route path="*" element={<RedirectToIndex />} />
      </Routes>
    </>
  )
}

export default App
