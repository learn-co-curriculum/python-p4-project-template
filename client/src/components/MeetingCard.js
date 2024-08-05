import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../index.css'; // Adjust the path as necessary
import { NavLink } from 'react-router-dom';

function MeetingCard({ meeting, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            topic: meeting.topic,
            scheduled_time: meeting.scheduled_time,
            location: meeting.location,
        },
        validationSchema: yup.object().shape({
            topic: yup.string().required('Must enter a topic').max(50),
            scheduled_time: yup.date().required('Must enter a valid date and time'),
            location: yup.string().required('Must enter a location').max(50),
        }),
        onSubmit: (values) => {
            fetch(`/meetings/${meeting.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error: ${response.statusText}\n${errorText}`);
                }
                return response.json();
            })
            .then((updatedMeeting) => {
                onUpdate(updatedMeeting);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error updating meeting:', error);
            });
        },
    });

    const handleDelete = () => {
        fetch(`/meetings/${meeting.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.ok) {
                onDelete(meeting.id);
            }
        })
        .catch((error) => {
            console.error('Error deleting meeting:', error);
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div key={meeting.id} className="card">
            {isEditing ? (
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type="text"
                        name="topic"
                        value={formik.values.topic}
                        onChange={formik.handleChange}
                        placeholder="Topic"
                    />
                    {formik.errors.topic && <p style={{ color: 'red' }}>{formik.errors.topic}</p>}
                    
                    <input
                        type="datetime-local"
                        name="scheduled_time"
                        value={formik.values.scheduled_time.slice(0, 16)} // Adjust format for datetime-local input
                        onChange={formik.handleChange}
                    />
                    {formik.errors.scheduled_time && <p style={{ color: 'red' }}>{formik.errors.scheduled_time}</p>}
                    
                    <input
                        type="text"
                        name="location"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        placeholder="Location"
                    />
                    {formik.errors.location && <p style={{ color: 'red' }}>{formik.errors.location}</p>}
                    
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <h3>Topic: {meeting.topic}</h3>
                    <p>Scheduled Time: {new Date(meeting.scheduled_time).toLocaleString()}</p>
                    <NavLink to={`/meetings/${meeting.id}`}>
                        <button id={meeting.id}>More Info</button>
                    </NavLink>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default MeetingCard;

