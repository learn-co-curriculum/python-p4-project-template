import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [noOfRegistrations, setNoOfRegistrations] = useState(0);
    const [creatorId, setCreatorId] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const newEvent = {
                title,
                description,
                date,
                location,
                no_of_registrations: noOfRegistrations,
                creator_id: creatorId
            };
            await axios.post('/events', newEvent);
            fetchEvents();
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setNoOfRegistrations(0);
            setCreatorId('');
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    return (
        <div>
            <h1>Events</h1>
            <form onSubmit={handleCreateEvent}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Date:</label>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>No of Registrations:</label>
                    <input
                        type="number"
                        value={noOfRegistrations}
                        onChange={(e) => setNoOfRegistrations(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Creator ID:</label>
                    <input
                        type="text"
                        value={creatorId}
                        onChange={(e) => setCreatorId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Event</button>
            </form>
            <h2>All Events</h2>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>
                        {event.title} - {event.description} - {event.date} - {event.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Events;
