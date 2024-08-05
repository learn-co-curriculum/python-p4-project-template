import React, { useEffect, useState } from 'react';
import ManagerCard from './ManagerCard';  // Import ManagerCard component
import { useFormik } from 'formik';
import * as yup from 'yup';

function ManagerPage() {
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/managers')
            .then(response => response.json())
            .then(data => setManagers(data))
            .catch(error => console.error('Error fetching managers:', error));
    }, []);


    const handleAdd = (newManager) => {
        fetch('http://localhost:4000/managers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newManager),
        })
        .then(response => response.json())
        .then(addedManager => {
            setManagers([...managers, addedManager]);
        })
        .catch(error => console.error('Error adding manager:', error));
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            department: '',
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Name is required').max(50, 'Name cannot exceed 50 characters'),
            department: yup.string().required('department is required').max(50, 'department cannot exceed 50 characters'),
        }),
        onSubmit: (values) => {
            handleAdd(values);
            formik.resetForm(); // Clear the form fields after submission
        },
    });

    const handleUpdateManager = (updatedManager) => {
        setManagers(managers.map(manager => 
            manager.id === updatedManager.id ? updatedManager : manager
        ));
    };

    const handleDeleteManager = (id) => {
        console.log(`Attempting to delete manager with id: ${id}`);
        fetch(`/managers/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            setManagers(managers.filter(manager => manager.id !== id));
        })
    };

    return (
        <div>
            <h1>Managers</h1>
            <form onSubmit={formik.handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                    <p style={{ color: 'red' }}>{formik.errors.name}</p>
                ) : null}
                <input
                    type="text"
                    name="department"
                    placeholder="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.department && formik.errors.department ? (
                    <p style={{ color: 'red' }}>{formik.errors.department}</p>
                ) : null}
                <button type="submit">Add Manager</button>
            </form>
            <ul>
                {managers.map(manager => (
                    <ManagerCard
                        key={manager.id}
                        manager={manager}
                        onDelete={handleDeleteManager}
                        onUpdate={handleUpdateManager}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ManagerPage;


