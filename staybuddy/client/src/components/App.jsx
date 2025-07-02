import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import StayList from './components/StayList';
import StayDetails from './components/StayDetails';
import BookingForm from './components/BookingForm';
import NewStayForm from './components/NewStayForm';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<StayList />} />
        <Route path="/stays/:id" element={<StayDetails />} />
        <Route path="/bookings" element={<BookingForm />} />
      </Routes>
    </Router>
  );
}

export default App;