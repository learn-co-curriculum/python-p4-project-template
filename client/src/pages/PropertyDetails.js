import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import BookingForm from '../components/BookingForm'
import axios from 'axios'

const PropertyDetails = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
  try {
    const response = await axios.get(`/api/properties/${id}`)
    console.log('Property data:', response.data); // Debug line
    setProperty(response.data)
  } catch (error) {
    console.error('Fetch property error:', error); // Debug line
    setError('Failed to load property details. Please try again later.')
  } finally {
    setLoading(false)
  }
}

  const handleBookingSubmit = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setBookingMessage('Please log in to make a booking.');
      return;
    }

    const response = await axios.post('/api/bookings', bookingData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    setBookingMessage('Booking successful! You will receive a confirmation email shortly.')
  } catch (error) {
    console.error('Booking error:', error.response?.data);
    setBookingMessage(error.response?.data?.message || error.response?.data?.error || 'Booking failed. Please try again.')
  }
}

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return '📶'
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return '🚗'
    if (amenityLower.includes('kitchen')) return '🍽️'
    if (amenityLower.includes('pool')) return '🏊'
    if (amenityLower.includes('gym')) return '💪'
    return '⭐'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg mb-4">
            <p className="text-red-800">{error || 'Property not found'}</p>
          </div>
          <Link to="/" className="inline-block">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span>←</span>
              <span>Back to Properties</span>
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const amenitiesList = property.amenities ? property.amenities.split(',').map(a => a.trim()) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-block mb-6">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <span>←</span>
            <span>Back to Properties</span>
          </button>
        </Link>

        <div className="flex justify-center">
       <div className="combined-card">

          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'}
                alt={property.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'
                }}
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white bg-opacity-90 px-3 py-2 rounded-lg text-sm font-semibold">
                  ⭐ 4.8 (24 reviews)
                </span>
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-md p-6 property-card">

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="mr-2">📍</span>
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-b py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">👥</span>
                      <span>Up to {property.max_guests} guests</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-900">${property.price_per_night}</span>
                    <span className="text-lg text-gray-600">/night</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                {amenitiesList.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-gray-700">
                          <span>{getAmenityIcon(amenity)}</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            {property.owner && (
              <div className="bg-white rounded-lg shadow-md p-6 owner-card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Owner</h3>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{property.owner.name}</h4>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">✉️</span>
                        <span>{property.owner.email}</span>
                      </div>
                      {property.owner.phone && (
                        <div className="flex items-center text-gray-600">
                          <span className="mr-2">📞</span>
                          <span>{property.owner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 booking-card">
              <BookingForm 
                propertyId={property.id} 
                onSubmit={handleBookingSubmit}
                pricePerNight={property.price_per_night}
              />
              {bookingMessage && (
                <div className={`mt-4 p-4 rounded-lg ${bookingMessage.includes('successful') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={bookingMessage.includes('successful') ? 'text-green-800' : 'text-red-800'}>
                    {bookingMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>

  )
}

export default PropertyDetails