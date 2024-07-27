import React from "react";
import { useHistory } from "react-router-dom";
import "../css/potcard.css";

function PortCard({ port }) {
  const history = useHistory();

  const handleViewShips = () => {
    history.push(`/ports/${port.id}/ships`);
  };

  return (
    <div className="port-card">
      <img src={port.image_url} alt={port.name} className="port-card-image" />
      <div className="port-card-content">
        <h3 className="card-title">{port.name}</h3>
        <p className="card-text">{port.location}</p>
        <button className="view-ships-btn" onClick={handleViewShips}>
          View Ships
        </button>
      </div>
    </div>
  );
}

export default PortCard;
