import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PropertyDetail.css';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5555/properties/${id}`)
      .then((res) => res.json())
      .then((data) => {
      setProperty(data);
      });
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className='property-container'>
      <div className='property-title'>
        <h1 className='property-title'>{property.title}</h1>
      </div>
      <p className='property-description'>{property.description}</p>
      <p className='property-price'>Price: ${property.price}</p>
      <p className='property-location'>Location: {property.address}</p>
      <img className='property-image' src={property.image} alt={property.title} />
    </div>
  );
};

export default PropertyDetail;