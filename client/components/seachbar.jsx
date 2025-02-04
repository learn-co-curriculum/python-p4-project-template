'use client'
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  return (
    <div className="flex items-center bg-white p-2 rounded-full shadow-md border border-gray-300 max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Search destinations"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="flex-1 px-4 py-2 outline-none text-gray-700"
      />
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        className="px-4 py-2 outline-none text-gray-700 rounded-lg"
      />
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        className="px-4 py-2 outline-none text-gray-700"
      />
      <input
        type="number"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className="w-20 px-4 py-2 outline-none text-gray-700"
      />
      <button className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600">
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;