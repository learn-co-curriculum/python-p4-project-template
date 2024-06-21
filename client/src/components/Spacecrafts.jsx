import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './spacecrafts.css';

function Spacecrafts({ spacecrafts = [], setSpacecrafts }) {
  const [visibleDetails, setVisibleDetails] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [editedCraft, setEditedCraft] = useState({});

  const toggleDetails = (id) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleEditClick = (craft) => {
    setEditMode(craft.id);
    setEditedCraft(craft);
  };

  const handleEditChange = (e) => {
    setEditedCraft({ ...editedCraft, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = (id) => {
    setSpacecrafts(prevSpacecrafts =>
      prevSpacecrafts.map(craft => (craft.id === id ? editedCraft : craft))
    );
    setEditMode(null);
  };


  return (
    <div className="container spacecraft-container">
      <h1 className="spacecraft-title my-5">🚀 Spacecrafts 🚀</h1>

      <div className="row">
        {spacecrafts.map((craft) => (
          <div key={craft.id} className="col-md-4 mb-3">
            <div className="card spacecraft-card" onClick={() => toggleDetails(craft.id)}>
              <img src={craft.image} className="card-img-top" alt={craft.name} />
              <div className="card-body">
                <h5 className="card-title">🚀 <strong>{craft.name}</strong> 🚀</h5>

                {editMode === craft.id ? (
                  // Edit Mode
                  <div className="details">
                    <input type="text" name="name" value={editedCraft.name} onChange={handleEditChange} />
                    <input type="number" name="speed" value={editedCraft.speed} onChange={handleEditChange} />
                    <input type="text" name="equipment" value={editedCraft.equipment} onChange={handleEditChange} />
                    <input type="number" name="fuel_log" value={editedCraft.fuel_log} onChange={handleEditChange} />
                    <input type="url" name="image" value={editedCraft.image} onChange={handleEditChange} />

                    <button onClick={() => handleSaveEdit(craft.id)} className="btn btn-success">Save</button>
                    <button onClick={() => setEditMode(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                ) : visibleDetails[craft.id] ? (
                  // View Mode (details expanded)
                  <div className="details">
                    <p className="card-text">Speed: {craft.speed}</p>
                    <p className="card-text">Fuel Log: {craft.fuel_log}</p>
                    <p className="card-text">Equipment: {craft.equipment}</p>
                    <button onClick={() => handleEditClick(craft)} className="btn btn-primary">Edit</button>
                    <button onClick={() => setSpacecrafts(prevCrafts => prevCrafts.filter(item => item.id !== craft.id))} className="btn btn-danger">Delete</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/spacecrafts/new">
        <button className="new-btn">Create New Spacecraft</button>
      </Link>
    </div>
  );
}

export default Spacecrafts;
