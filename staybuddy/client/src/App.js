import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import StayList from './components/StayList';
import StayDetails from './components/StayDetails';
import NewStayForm from './components/NewStayForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import BookingForm from './components/BookingForm'; // to be implemented
import MyBookings from './components/MyBookings';   // to be implemented
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<StayList />} />
          <Route path="/stays/:id" element={<StayDetails />} />
          <Route path="/host/new" element={<NewStayForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/book/:stayId" element={<BookingForm />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </>
  );
}


export default App;
