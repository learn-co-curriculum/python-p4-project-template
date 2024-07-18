// TravelGuideList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const TravelGuideList = () => {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await api.get('/guides');
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  return (
    <div className="guide-list">
      <h3>Travel Guides</h3>
      <div className="card-container">
        {guides.map(guide => (
          <div key={guide.id} className="card">
            <h4>{guide.title}</h4>
            <p>{guide.description}</p>
            <Link to={`/guides/${guide.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelGuideList;