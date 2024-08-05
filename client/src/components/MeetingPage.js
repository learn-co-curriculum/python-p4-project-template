import React, { useEffect, useState } from 'react';
import MeetingCard from './MeetingCard';  // Import MeetingCard component
import { useFormik } from 'formik';
import * as yup from 'yup';

function MeetingPage() {
    const [meetings, setMeetings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:4000/meetings')
            .then(response => response.json())
            .then(data => {
                setMeetings(data);
            })
            .catch(error => {
                console.error('Error fetching meetings:', error);
                setError('Failed to fetch meetings.');
            });
    }, []);

    const formSchema = yup.object().shape({
        topic: yup.string().required("Topic is required").max(50, "Topic must be at most 50 characters"),
        scheduled_time: yup.date().required("Scheduled time is required"),
        location: yup.string().required("Location is required").max(50, "Location must be at most 50 characters")
    });

    const formik = useFormik({
        initialValues: {
            topic: '',
            scheduled_time: '',
            location: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('http://localhost:4000/meetings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(response => response.json())
            .then((addedMeeting) => {
                setMeetings([...meetings, addedMeeting]);
                if (addedMeeting.id) {
                    console.log(addedMeeting.id);
                }
            })
            .catch(error => {
                console.error('Error adding meeting:', error);
            });
        },
    });

    const handleDelete = (id) => {
        fetch(`/meetings/${id}`, {
            method: 'DELETE',
        })
        .then(
            setMeetings(meetings.filter(meeting => meeting.id !== id))
        )
        .catch(error => {
            console.error('Error:', error);
        });
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Meetings</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    id="topic"
                    type="text"
                    placeholder="Topic"
                    value={formik.values.topic}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.topic}</p>

                <input
                    id="scheduled_time"
                    type="datetime-local"
                    value={formik.values.scheduled_time}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.scheduled_time}</p>

                <input
                    id="location"
                    type="text"
                    placeholder="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                />
                <p style={{ color: "red" }}>{formik.errors.location}</p>

                <button type="submit">Add Meeting</button>
            </form>
            <ul>
                {meetings.map(meeting => (
                    <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onDelete={handleDelete}
                        onUpdate={(updatedMeeting) => {
                            setMeetings(meetings.map(meet =>
                                meet.id === updatedMeeting.id ? updatedMeeting : meet
                            ));
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}

export default MeetingPage;
