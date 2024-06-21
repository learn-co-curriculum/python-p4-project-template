import React, { useState, useEffect } from 'react';
import { useSpace } from '../App';
import { Card, Button, ListGroup, ButtonGroup } from 'react-bootstrap';
import './spacecrafts.css';
import NewSpaceCraftForm from './NewSpaceCraftForm'

const Spacecrafts = () => {
  const { spacecrafts, toggleSpacecraft } = useSpace();
  const [selectedSpacecraftId, setSelectedSpacecraftId] = useState(() => {
    const saved = localStorage.getItem("selectedSpacecraftId");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("selectedSpacecraftId", JSON.stringify(selectedSpacecraftId));
  }, [selectedSpacecraftId]);

  const handleSelect = (id) => {
    setSelectedSpacecraftId(id);
  };

  const handleDeselect = () => {
    setSelectedSpacecraftId(null);
  };

  console.log('Spacecrafts to render:', spacecrafts);

  return (
    <div className="container">
      <h1 className="spacecraft-title my-3"><span className="emoji">🚀</span> Spacecrafts <span className="emoji">🚀</span></h1>
      <div className="row">
        {spacecrafts && spacecrafts.length > 0 ? (
          spacecrafts.map((spacecraft) => (
            <div key={spacecraft.id} className="col-md-4 mb-3">
              <Card className="spacecraft-card" onClick={() => handleSelect(spacecraft.id)}>
                <Card.Img variant="top" src={spacecraft.image} />
                <Card.Body>
                  <Card.Title className="card-title">{spacecraft.name}</Card.Title>
                  <Card.Text className="card-text">{spacecraft.equipment}</Card.Text>
                  <Card.Text className="card-text">Speed: {spacecraft.speed} km/h</Card.Text>
                  <Card.Text className="card-text">Fuel Log: {spacecraft.fuel_log}</Card.Text>
                  {selectedSpacecraftId === spacecraft.id && (
                    <ButtonGroup vertical>
                      <Button variant="primary" onClick={handleDeselect}>Unselect Spacecraft</Button>
                      <Button variant="danger" onClick={() => toggleSpacecraft(spacecraft)}>Toggle Spacecraft</Button>
                    </ButtonGroup>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div>No spacecrafts available</div>
        )}
      </div>
      <NewSpaceCraftForm />
    </div>
  );
};

export default Spacecrafts;


