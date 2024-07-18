// TravelGuideDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TravelGuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    fetchGuide();
  }, [id]);

  const fetchGuide = async () => {
    try {
      const response = await api.get(`/guides/${id}`);
      setGuide(response.data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    }
  };

  if (!guide) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{guide.title}</h2>
      <p>{guide.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default TravelGuideDetail;
