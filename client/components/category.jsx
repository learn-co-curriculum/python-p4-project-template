'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaFilter } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import Filters from "@/app/filter/page";

const categories = [
  { name: "OMG!", icon: "🏕️", path: "/omg" },
  { name: "Islands", icon: "🏝️", path: "/islands" },
  { name: "Design", icon: "🏠", path: "/design" },
  { name: "New", icon: "✨", path: "/new" },
  { name: "Tropical", icon: "🌴", path: "/tropical" },
  { name: "Top cities", icon: "🏙️", path: "/top-cities" },
  { name: "Skiing", icon: "⛷️", path: "/skiing" },
  { name: "Farms", icon: "🚜", path: "/farms" },
  { name: "Shepherd's huts", icon: "🏡", path: "/shepherds-huts" },
  { name: "Desert", icon: "🏜️", path: "/desert" },
  { name: "Camping", icon: "⛺", path: "/camping" },
  { name: "Castles", icon: "🏰", path: "/castles" },
  { name: "Caves", icon: "🕳️", path: "/caves" },
  { name: "Arctic", icon: "❄️", path: "/arctic" },
];
<Filters />

const CategorySection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    placeType: "any",
    priceMin: 1300,
    priceMax: 46000,
    bedrooms: "",
    beds: "",
    bathrooms: "",
    standoutStays: false,
  });
  const router = useRouter();

  const handleCategoryClick = (category) => {
    if (selectedCategory === category.name) return;
    setSelectedCategory(category.name);
    if (category.path) {
      router.push(category.path);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  return (
    <>
      <div className="flex items-center justify-between bg-white p-4 shadow-md border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-wrap justify-start space-x-4 space-y-3 overflow-x-auto max-w-full">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex flex-col items-center text-sm transition-colors duration-200 ${
                selectedCategory === category.name ? "text-red-600 font-bold" : "text-gray-800 hover:text-orange-500"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={openFilter}
            className="flex items-center space-x-2 bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 text-white"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onClose={closeFilter} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />
        <div className="min-h-screen px-4 text-center flex items-center justify-center">
          <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <Dialog.Title className="text-3xl font-bold text-gray-900 mb-4">Filters</Dialog.Title>
            <div className="mt-4">
              {/* Type of Place */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Type of place</h3>
                <div className="flex space-x-4">
                  {["any", "room", "entireHome"].map((type) => (
                    <label key={type} className="text-gray-700 hover:text-gray-900">
                      <input
                        type="radio"
                        name="placeType"
                        value={type}
                        checked={filters.placeType === type}
                        onChange={handleFilterChange}
                        className="mr-2"
                      />
                      {type === "any" ? "Any type" : type === "room" ? "Room" : "Entire home"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Price range</h3>
                <div className="flex items-center space-x-4">
                  <label className="text-gray-700">
                    Minimum:{" "}
                    <input
                      type="number"
                      name="priceMin"
                      value={filters.priceMin}
                      onChange={handleFilterChange}
                      className="border p-2 rounded-lg w-20 text-gray-900"
                    />
                  </label>
                  <label className="text-gray-700">
                    Maximum:{" "}
                    <input
                      type="number"
                      name="priceMax"
                      value={filters.priceMax}
                      onChange={handleFilterChange}
                      className="border p-2 rounded-lg w-20 text-gray-900"
                    />
                  </label>
                </div>
              </div>

              {/* Rooms and Beds */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Rooms and beds</h3>
                <div className="grid grid-cols-3 gap-4">
                  {["bedrooms", "beds", "bathrooms"].map((roomType) => (
                    <label key={roomType} className="text-gray-700">
                      {roomType.charAt(0).toUpperCase() + roomType.slice(1)}:{" "}
                      <input
                        type="number"
                        name={roomType}
                        value={filters[roomType]}
                        onChange={handleFilterChange}
                        className="border p-2 rounded-lg w-16 text-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Booking Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Booking options</h3>
                <label className="text-gray-700">
                  <input
                    type="checkbox"
                    name="standoutStays"
                    checked={filters.standoutStays}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  Standout stays
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeFilter}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={closeFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CategorySection;
