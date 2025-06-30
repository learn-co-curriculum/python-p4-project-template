import { useEffect, useState } from 'react';
import { getToken } from '../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/bookings', {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map(b => (
            <li key={b.id}>
              Stay ID: {b.stay_id}, from {b.start_date} to {b.end_date}
              {b.note && <p>Note: {b.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;