import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewCraftForm.css';

function NewSpacecraftForm({ spacecrafts, setSpacecrafts }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        speed: 0,
        equipment: "",
        fuel_log: 0,
        image: undefined,
});

    const navigate = useNavigate();

    const  handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newSpacecraft = { ...formData, id: (Math.max(...spacecrafts.map(craft => parseInt(craft.id, 10))) +1).toString() };

        setSpacecrafts([...spacecrafts, newSpacecraft]);
        navigate("/");
    };

    return (
        <div className="new-craft-form">
            <h2>Create New Spacecraft!</h2>
            <form className="new-space-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="speed">Speed:</label>
                    <input type="number" id="speed" name="speed" value={formData.speed} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="equipment">Equipment:</label>
                    <input type="text" id="equipment" name="equipment" value={formData.equipment} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="fuel_log">Fuel Log:</label>
                    <input type="text" id="fuel_log" name="fuel_log" value={formData.fuel_log} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} />
                </div>
            
                <button type="submit">Create Spacecraft!</button>
            </form>
        </div>
    );
}

export default NewSpacecraftForm;