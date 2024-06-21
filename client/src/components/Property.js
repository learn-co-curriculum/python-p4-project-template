import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Property.css';


function Property({ property }) {
  return (
    <div className='property-container'>
      <div className='property-title-container'>
        <h1 className='property-title'>{property.title}</h1>
      </div>
      <div className='property-image-container'>
        <img className='property-image' src={property.image} alt={property.title} />
      </div>
      <ul className='property-info-container'>
        <li className='property-item'>Price: {`$${property.price}`}</li>
        <li className='property-item'>Location: {property.address}</li>
        <li className='property-item'>Description: {property.description}</li>
      </ul>
      <Link className='property-link' to={{
        pathname: `/property/${property.id}`,
      }}
        >
        View Details</Link>
    </div>
  );
};

export default Property;
