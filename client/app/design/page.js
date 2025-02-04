'use client'
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const PropertyList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    guestFavorite: false,
  });

  const properties = [
    {
      id: 1,
      image: "Boho.jpeg",
      location: "Nairobi, Kenya",
      distance: "3 kilometers away",
      date: "Feb 2 - 5",
      price: 12229,
      rating: 4.9,
      isGuestFavorite: true,
    },
    {
      id: 2,
      image: "Contemporary.jpeg",
      location: "Westlands, Kenya",
      distance: "6 kilometers away",
      date: "Feb 10 - 15",
      price: 10882,
      rating: 4.7,
      isGuestFavorite: false,
    },
    {
      id: 3,
      image: "2.jpeg",
      location: "Mombasa, Kenya",
      distance: "10 kilometers away",
      date: "Mar 1 - 5",
      price: 8740,
      rating: 4.6,
      isGuestFavorite: true,
    },
    {
        id: 3,
        image: "3.jpeg",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "4.jpeg",
        location: "Lamu, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "5.jpeg",
        location: "Karen, Kenya",
        distance: "4 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "6.jpeg",
        location: "Karen, Kenya",
        distance: "6 kilometers away",
        date: "Mar 2 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "7.jpeg",
        location: "Muthaiga North, Kenya",
        distance: "8 kilometers away",
        date: "feb 1 - 5",
        price: 8000,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "8.jpeg",
        location: "Nyali, Kenya",
        distance: "7 kilometers away",
        date: "June 6 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "9.jpeg",
        location: "Nanyuki, Kenya",
        distance: "127kilometers away",
        date: "Mar 2 - 5",
        price: 7000,
        rating: 4.4,
        isGuestFavorite: true,
      },
      {
        id: 10,
        image: "10.jpeg",
        location: "Moyale, Kenya",
        distance: "76 kilometers away",
        date: "Feb 1 - 5",
        price: 50000,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 11,
        image: "11.jpeg",
        location: "Kilifi, Kenya",
        distance: "2 kilometers away",
        date: "june 1 - 5",
        price: 8000,
        rating: 4.9,
        isGuestFavorite: true,
      },
      {
        id: 12,
        image: "12.jpeg",
        location: "Edens, Kenya",
        distance: "10 kilometers away",
        date: "Jan 8 - 13",
        price: 9000,
        rating: 4.9,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "12.jpeg",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      }, {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300x200",
        location: "Mombasa, Kenya",
        distance: "10 kilometers away",
        date: "Mar 1 - 5",
        price: 8740,
        rating: 4.6,
        isGuestFavorite: true,
      },
    
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const filteredProperties = properties.filter((property) => {
    const matchesPrice =
      (!filters.minPrice || property.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || property.price <= parseFloat(filters.maxPrice));
    const matchesRating =
      !filters.minRating || property.rating >= parseFloat(filters.minRating);
    const matchesGuestFavorite =
      !filters.guestFavorite || property.isGuestFavorite;
    const matchesSearch =
      property.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPrice && matchesRating && matchesGuestFavorite && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search location..."
          className="border p-2 rounded-lg w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-4">
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            className="border p-2 rounded-lg w-24"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            className="border p-2 rounded-lg w-24"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minRating"
            placeholder="Min Rating"
            className="border p-2 rounded-lg w-24"
            value={filters.minRating}
            onChange={handleFilterChange}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="guestFavorite"
              checked={filters.guestFavorite}
              onChange={handleFilterChange}
            />
            Guest Favorite
          </label>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={property.image}
              alt={property.location}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">
                  {property.location}
                </h3>
                <button className="text-red-500 hover:text-red-700">
                  <FaHeart />
                </button>
              </div>
              <p className="text-gray-500 text-sm">{property.distance}</p>
              <p className="text-gray-500 text-sm">{property.date}</p>
              <p className="text-lg font-bold text-gray-800">
                Ksh {property.price.toLocaleString()} / night
              </p>
              <p className="text-yellow-500 font-medium">⭐ {property.rating}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No properties found.</p>
      )}
    </div>
  );
};

export default PropertyList;
