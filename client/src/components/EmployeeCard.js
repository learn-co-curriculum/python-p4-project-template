import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import '../index.css'; // Adjust the path as necessary
import { NavLink } from 'react-router-dom';

function EmployeeCard({ employee, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: employee.name,
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Must enter a name').max(50),
        }),
        onSubmit: (values) => {
            fetch(`/employees/${employee.id}`, {
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
            .then((updatedEmployee) => {
                onUpdate(updatedEmployee);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error updating employee:', error);
            });
        },
    });

    const handleDelete = () => {
        fetch(`/employees/${employee.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.ok) {
                onDelete(employee.id);
            }
        })
        .catch((error) => {
            console.error('Error deleting employee:', error);
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div key={employee.id} className="card">
            {isEditing ? (
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Name"
                        />
                        {formik.errors.name && formik.touched.name && (
                            <p style={{ color: 'red' }}>{formik.errors.name}</p>
                        )}
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <h3>Name: {employee.name}</h3>
                    <p>Hire Date: {new Date(employee.hire_date).toLocaleDateString()}</p>
                    <NavLink to={`/employees/${employee.id}`}>
                        <button id={employee.id}>More Info</button>
                    </NavLink>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default EmployeeCard;

