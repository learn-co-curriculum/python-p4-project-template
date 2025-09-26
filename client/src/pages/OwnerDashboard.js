
import React, { useEffect, useState } from "react";
import api from "../services/api";
// Then add <Footer /> at the bottom of your JSX return statement
const PropertyForm = ({ property, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: property?.name || '',
    description: property?.description || '',
    location: property?.location || '',
    price_per_night: property?.price_per_night || '',
    max_guests: property?.max_guests || '',
    amenities: property?.amenities || '',
    owner_id: property?.owner_id || 1,
    image_urls: property?.images?.map(img => img.image_url).join('\n') || '' // Add image URLs
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First save the property
      let savedProperty;
      if (property) {
        // Editing existing property
        const res = await api.patch(`/properties/${property.id}`, {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price_per_night: parseFloat(formData.price_per_night),
          max_guests: parseInt(formData.max_guests),
          amenities: formData.amenities,
          owner_id: formData.owner_id
        });
        savedProperty = res.data;
      } else {
        // Creating new property
        const res = await api.post('/properties', {
          name: formData.name,
          description: formData.description,
          location: formData.location,
          price_per_night: parseFloat(formData.price_per_night),
          max_guests: parseInt(formData.max_guests),
          amenities: formData.amenities,
          owner_id: formData.owner_id
        });
        savedProperty = res.data;
      }

      // Handle image URLs if provided
      if (formData.image_urls.trim()) {
        const imageUrls = formData.image_urls.split('\n').filter(url => url.trim());
        
        // If editing, delete existing images first
        if (property) {
          for (const image of property.images || []) {
            await api.delete(`/properties/images/${image.id}`);
          }
        }

        // Add new images
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i].trim();
          if (imageUrl) {
            await api.post(`/properties/${savedProperty.id}/images/url`, {
              image_url: imageUrl,
              image_name: `image_${i + 1}.jpg`,
              is_featured: i === 0, // First image is featured
              upload_order: i
            });
          }
        }
      }

      onSave();
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Error saving property. Please try again.');
    }
  };

  return (
    <div className="property-form-overlay">
      <div className="property-form">
        <h3>{property ? 'Edit Property' : 'Add New Property'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Property Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price per night"
            value={formData.price_per_night}
            onChange={(e) => setFormData({...formData, price_per_night: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Max guests"
            value={formData.max_guests}
            onChange={(e) => setFormData({...formData, max_guests: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Amenities (e.g., WiFi, Pool, Kitchen)"
            value={formData.amenities}
            onChange={(e) => setFormData({...formData, amenities: e.target.value})}
          />
          <textarea
            placeholder="Image URLs (one per line)"
            value={formData.image_urls}
            onChange={(e) => setFormData({...formData, image_urls: e.target.value})}
            rows="4"
          />
          <small style={{color: '#666', marginBottom: '10px', display: 'block'}}>
            Enter image URLs, one per line. First image will be the featured image.
          </small>
          <div className="form-buttons">
            <button type="submit">Save Property</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("properties");
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const checkUserType = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (userResponse.data.user.user_type !== 'owner') {
        setError("Access denied. Owner privileges required.");
        return;
      }
      setCurrentUser(userResponse.data.user);
    } catch (err) {
      setError("Authentication failed.");
    }
  };
  
  checkUserType();
}, []);

  useEffect(() => {
  if (properties.length > 0) {
    fetchBookings();
  }
}, [properties]);

useEffect(() => {
  fetchProperties();
}, []);

const fetchProperties = async () => {
  try {
    // Get current user info
    const token = localStorage.getItem('token');
    const userResponse = await api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const currentUser = userResponse.data.user;
    

    // Fetch all properties, then filter by owner_id
    const res = await api.get('/properties');
    const ownerProperties = res.data.filter(property => 
      property.owner_id === currentUser.id && currentUser.user_type === 'owner'
    );

    
    setProperties(ownerProperties);
  } catch (err) {
    setError("Failed to load properties. Please try again.");
  }
};


const fetchBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get("/owner/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setBookings(res.data);
  } catch (err) {
    setError("Failed to load bookings. Please try again.");
  }
};

const handleDeleteProperty = async (id) => {
  if (window.confirm('Are you sure you want to delete this property?')) {
    try {
      await api.delete(`/properties/${id}`);
      fetchProperties(); // Refresh the list
      setError(null);
    } catch (err) {
      setError("Failed to delete property.");
    }
  }
};
  
  const renderStars = (rating = 4.8) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    return stars;
  };
   const handleSaveProperty = () => {
  setShowPropertyForm(false);
  setEditingProperty(null);
  fetchProperties(); // Refresh the list
  setError(null);
};

const handleCancelForm = () => {
  setShowPropertyForm(false);
  setEditingProperty(null);
};
  return (
    <div className="luxury-dashboard"> 
      <div className="container"> 
        
        <div className="dashboard-header">
          <h1 className="main-title">Luxury Rooms & Suites</h1>
          <p className="subtitle">Manage Your Properties</p>
        </div>

       
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

      
        <div className="luxury-tabs">
          <button
            onClick={() => setActiveTab("properties")}
            className={`tab-button ${activeTab === "properties" ? "active" : ""}`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          >
            Bookings
          </button>    
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="content-section"> 
            <div className="section-header">
              <h2 className="section-title">Your Properties</h2>
              <button
                onClick={() => {
                  setEditingProperty(null);
                  setShowPropertyForm(true);
                }}
                className="add-property-btn"
              >
                Add Property
              </button>
            </div>

            {properties.length === 0 ? (
              
              <div className="empty-state">
                <p>No properties available.</p>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map((property) => (
                  <div key={property.id} className="property-card">
                    <div className="property-image-container">
                      <img
                         src={property.images && property.images.length > 0 
                            ? (property.images.find(img => img.is_featured) || property.images[0]).image_url 
                            : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"} 
                         alt={property.name}
                         className="property-image"
                         onError={(e) => { 
                           e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop'
                         }}
                      />
                    
                      <div className="property-rating">
                        <div className="stars">
                          {renderStars(4.8)}
                        </div>
                        <span className="rating-number">4.8</span>
                      </div>
                    </div>
                 
                    <div className="property-content"> 
                      <div className="property-header"> 
                        <h3 className="property-name">{property.name}</h3>
                      </div>
                      
                      <p className="property-location">{property.location}</p>
                      
                      
                      {property.description && (
                        <p className="property-description">{property.description}</p>
                      )}

                    
                      <div className="property-details">
                        <div className="guest-info"> 
                          <span className="detail-label">Maximum Guests</span>
                          <span className="detail-value">{property.max_guests || 2}</span>
                        </div>
                        
                        <div className="price-section"> 
                          <span className="price">${property.price_per_night}</span>
                          <span className="price-period">per night</span>
                        </div>
                      </div>

                      <div className="property-actions">
                        <button
                          onClick={() => {
                            setEditingProperty(property);
                            setShowPropertyForm(true);
                          }}
                          className="booking-action-btn secondary" 
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="booking-action-btn danger" 
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {/* Bookings Tab */}
{activeTab === "bookings" && (
  <div className="content-section">
    <div className="section-header">
      <h2 className="section-title">Your Property Bookings</h2>
      <div className="booking-stats">
        <span className="stat-item">
          <strong>{bookings.filter(b => b.booking_status === 'confirmed').length}</strong> Confirmed
        </span>
        <span className="stat-item">
          <strong>{bookings.filter(b => b.booking_status === 'cancelled').length}</strong> Cancelled
        </span>
        <span className="stat-item">
          <strong>${bookings.filter(b => b.booking_status === 'confirmed').reduce((sum, b) => sum + (b.total_price || 0), 0).toFixed(2)}</strong> Total Revenue
        </span>
      </div>
    </div>

    {bookings.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <h3>No Bookings Yet</h3>
        <p>Your property bookings will appear here once guests start making reservations.</p>
      </div>
    ) : (
      <div className="bookings-grid">
        {bookings.map((booking) => {
          const property = properties.find(p => p.id === booking.property_id);
          const checkIn = new Date(booking.check_in_date);
          const checkOut = new Date(booking.check_out_date);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          const isUpcoming = checkIn > new Date();
          const isActive = checkIn <= new Date() && checkOut >= new Date();
          
          return (
            <div key={booking.id} className={`booking-card-modern ${booking.booking_status}`}>
              {/* Property Image */}
              <div className="booking-image-section">
                {property && (
                  <img
                    src={property.images && property.images.length > 0 
                      ? (property.images.find(img => img.is_featured) || property.images[0]).image_url 
                      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop"}
                    alt={property.name}
                    className="booking-property-image"
                  />
                )}
                <div className="booking-status-badge">
                  <span className={`status-indicator ${booking.booking_status}`}>
                    {booking.booking_status === 'confirmed' && '✓'}
                    {booking.booking_status === 'cancelled' && '✕'}
                  </span>
                  <span className="status-text">
                    {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="booking-details-modern">
                <div className="booking-header">
                  <h3 className="booking-property-name">{property?.name}</h3>
                  <div className="booking-location">📍 {property?.location}</div>
                </div>

                <div className="guest-info-modern">
                  <div className="guest-avatar">
                    {booking.guest_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="guest-details">
                    <div className="guest-name">{booking.guest_name}</div>
                    <div className="guest-email">{booking.guest_email}</div>
                  </div>
                </div>

                <div className="booking-dates-modern">
                  <div className="date-range">
                    <div className="date-item">
                      <span className="date-label">Check-in</span>
                      <span className="date-value">
                        {checkIn.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="date-separator">→</div>
                    <div className="date-item">
                      <span className="date-label">Check-out</span>
                      <span className="date-value">
                        {checkOut.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="nights-info">{nights} night{nights !== 1 ? 's' : ''}</div>
                </div>

                <div className="booking-footer">
                  <div className="booking-price">
                    <span className="price-amount">${booking.total_price || 'N/A'}</span>
                    <span className="price-label">Total</span>
                  </div>
                  
                  {isUpcoming && booking.booking_status === 'confirmed' && (
                    <div className="booking-timing upcoming">Upcoming</div>
                  )}
                  {isActive && booking.booking_status === 'confirmed' && (
                    <div className="booking-timing active">Active Stay</div>
                  )}
                  
                  <div className="booking-actions-modern">
                    <button className="action-btn-modern view">View Details</button>
                    {booking.booking_status === 'confirmed' && (
                      <button className="action-btn-modern contact">Contact Guest</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}
         {showPropertyForm && (
          <PropertyForm
            property={editingProperty}
            onSave={handleSaveProperty}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;