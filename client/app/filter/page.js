import React, { useState } from "react";

const Filters = () => {
  const [filters, setFilters] = useState({
    type: "any",
    priceRange: [1300, 18000],
    amenities: {
      wifi: false,
      kitchen: false,
      washer: false,
      dryer: false,
      airConditioning: false,
      heating: false,
    },
    standout: false,
  });

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: "any",
      priceRange: [1300, 18000],
      amenities: {
        wifi: false,
        kitchen: false,
        washer: false,
        dryer: false,
        airConditioning: false,
        heating: false,
      },
      standout: false,
    });
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4">Filters</h2>

      {/* Type of Place */}
      <div className="mb-4">
        <h3 className="font-semibold">Type of place</h3>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: "any" }))}
            className={`px-4 py-2 border rounded-lg ${
              filters.type === "any" ? "bg-gray-200 font-bold" : "bg-white"
            }`}
          >
            Any type
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: "room" }))}
            className={`px-4 py-2 border rounded-lg ${
              filters.type === "room" ? "bg-gray-200 font-bold" : "bg-white"
            }`}
          >
            Room
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: "entire" }))}
            className={`px-4 py-2 border rounded-lg ${
              filters.type === "entire" ? "bg-gray-200 font-bold" : "bg-white"
            }`}
          >
            Entire home
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-semibold">Price range</h3>
        <div className="flex items-center gap-4 mt-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handlePriceChange(Number(e.target.value), filters.priceRange[1])
            }
            className="border p-2 rounded-lg w-20"
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handlePriceChange(filters.priceRange[0], Number(e.target.value))
            }
            className="border p-2 rounded-lg w-20"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <h3 className="font-semibold">Amenities</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.keys(filters.amenities).map((amenity) => (
            <button
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`px-3 py-1 border rounded-lg ${
                filters.amenities[amenity]
                  ? "bg-gray-200 font-bold"
                  : "bg-white"
              }`}
            >
              {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Standout Stays */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.standout}
            onChange={() =>
              setFilters((prev) => ({ ...prev, standout: !prev.standout }))
            }
          />
          <span className="font-semibold">Guest favorite</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={clearFilters}
          className="px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Clear all
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Show 1,000+ places
        </button>
      </div>
    </div>
  );
};

export default Filters;

