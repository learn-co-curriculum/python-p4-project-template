import React, { useEffect, useState } from 'react';
import '../styles/PropertyList.css';
import Property from './Property';

function PropertyList() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5555/properties')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        console.log(data)
      });
  }, []);

  return (
    <div className='propertylist-container'>
      {properties.map((property) => (
        <div><Property key={property.id} property={property} /></div>
      ))}
    </div>
  );
}

export default PropertyList;