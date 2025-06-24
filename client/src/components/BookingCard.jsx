import react from 'react';

function BookingCard({ booking }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
    }}>
      <h3>📅 Appointment</h3>
      <p><strong>Name:</strong> {booking.fullName}</p>
      <p><strong>Email:</strong> {booking.email}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Service:</strong> {booking.service}</p>
      <p><strong>Fundi ID:</strong> {booking.workerId}</p>
    </div>
  );
}

export default BookingCard;
