
import {useState, useEffect } from  'react'

function BookingForm({ worker, onBook}){

    const [formData, setFormData] = useState({
        fullName : '',
        email : '',
        date: '',
        service: worker?.service || '',
    })
    // this state tracks what the user types into the form
    // service is pre-filled using the selected worker's service.
    const [isSubmitting, setIsSubmitting] = useState(false);
    // this holds the form data after the user clicks submit
    
    function handleChange(e) {
        setFormData ({...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmittedData(formData); 
    }
            fetch('/bookings', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...formData, workerId:worker?.id}),
            })
            .then((data) => {
                onBook(data) // send data back to the booking page
                setFormData({
                            fullName: '',
                            email: '',
                            date: '',
                            service: worker?.service || '',
                })
            })
            .catch((err) => alert(err.message))
            .finally(() => setIsSubmitting(false))
    return (
        <div>
            <h2>Booking for {worker.name}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Full Name:
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Email:
                    <input name="email" type='email' value={formData.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Date:
                    <input name='date' type='date' value={formData.date} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Service:
                    <input name="service" value={formData.service} readOnly />
                </label>
                <br />
                <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}</button>
            </form>

        </div>
    );
    }


export default BookingForm
