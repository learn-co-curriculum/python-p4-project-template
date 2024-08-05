import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../index.css'; // Adjust the path as necessary

function ManagerCard({ manager, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: manager.name,
            department: manager.department,
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Must enter a name').max(50),
            department: yup.string().required('Must enter a department').max(50),
        }),
        onSubmit: (values) => {
            fetch(`/managers/${manager.id}`, {
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
            .then((updatedManager) => {
                onUpdate(updatedManager);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error updating manager:', error);
            });
        },
    });

    const handleDelete = () => {
        fetch(`/managers/${manager.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.ok) {
                onDelete(manager.id);
            }
        })
        .catch((error) => {
            console.error('Error deleting manager:', error);
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div key={manager.id} className="card">
            {isEditing ? (
                <form onSubmit={formik.handleSubmit} className="manager-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            placeholder="Name"
                        />
                        {formik.errors.location && <p style={{ color: 'red' }}>{formik.errors.location}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">department:</label>
                        <input
                            type="text"
                            name="department"
                            value={formik.values.department}
                            onChange={formik.handleChange}
                            placeholder="department"
                        />
                        {formik.errors.location && <p style={{ color: 'red' }}>{formik.errors.location}</p>}
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <h3>Name: {manager.name}</h3>
                    <p>department: {manager.department}</p>
                    <NavLink to={`/managers/${manager.id}`}>
                        <button id={manager.id}>View Staff</button>
                    </NavLink>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default ManagerCard;



