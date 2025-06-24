import { useLocation } from 'react-router-dom';
import {useState, usEffect } from 'react';
import BookingForm from '../components/BookingForm';
import Bookingcard from '../components/BookingCard';

function Booking(){
    const location = useLocation;
    const { worker } = location.state || {};

    const [bookings, setBookings] = useState([])

    function fetchBookings() {
        fetch('/bookings')
        .then((res) => res.json())
        .then((data) => setBookings(data))
        .catch(() => alert('Failed to fetch bookings'));
    }
    useEffect(() => {
        fetchBookings();
    }, [])

    if (!worker) return <p>No fundi selected. Go back and choose a worker.</p>

    return (
        <div  style={{ maxWidth: '600px', margin: '0 auto' }} >
            <h2>Book an Appointment with {worker.name}</h2>

            <BookingForm worker={worker} onBook={fetchBookings} />

            <h3 style={{ marginTop: '2rem' }} > All Appointments </h3>
            {bookings.length === 0 ? (
                <p> No bookings yet.</p>
            ): (
                bookings.map((booking) => (
                    <Bookingcard key={booking.id} booking={booking} />

                ))
            )}
        </div>
    );
}

export 