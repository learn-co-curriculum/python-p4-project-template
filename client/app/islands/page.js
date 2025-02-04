import React from "react";
import SearchBar from "@/components/seachbar";
import Navbar from "@/components/Navbar";

export default function IslandsPage() {
  const islands = [
    { id: 1, location: "New York", price: "$150", rooms: 2, available: true, images: ["Today1.jpeg"] },
    { id: 2, location: "Los Angeles", price: "$200", rooms: 3, available: false, images: ["Today2.jpeg"] },
    { id: 3, location: "San Francisco", price: "$180", rooms: 1, available: true, images: ["Today3.jpeg"] },
    { id: 4, location: "Miami", price: "$170", rooms: 2, available: true, images: ["Today4.jpeg"] },
    { id: 5, location: "Chicago", price: "$130", rooms: 4, available: false, images: ["Today5.jpeg"] },
    { id: 6, location: "Austin", price: "$160", rooms: 2, available: true, images: ["Today6.jpeg"] },
    { id: 7, location: "Seattle", price: "$210", rooms: 3, available: false, images: ["Today7.jpeg"] },
    { id: 8, location: "Las Vegas", price: "$220", rooms: 5, available: true, images: ["Today8.jpeg"] },
    { id: 9, location: "Denver", price: "$140", rooms: 2, available: true, images: ["Today9.jpeg"] },
    { id: 10, location: "San Diego", price: "$190", rooms: 3, available: true, images: ["Today10.jpeg"] },
    { id: 11, location: "Boston", price: "$230", rooms: 4, available: false, images: ["Today11.jpeg"] },
    { id: 12, location: "Dallas", price: "$120", rooms: 1, available: true, images: ["Today12.jpeg"] },
    { id: 13, location: "Phoenix", price: "$160", rooms: 3, available: true, images: ["Today13.jpeg"] },
    { id: 14, location: "Portland", price: "$180", rooms: 2, available: false, images: ["Today14.jpeg"] },
    { id: 15, location: "Orlando", price: "$150", rooms: 3, available: true, images: ["Today15.jpeg"] },
    { id: 16, location: "Nashville", price: "$170", rooms: 4, available: false, images: ["Today16.jpeg"] },
    { id: 17, location: "Washington DC", price: "$250", rooms: 5, available: true, images: ["Today17.jpeg"] },
    { id: 18, location: "Atlanta", price: "$190", rooms: 3, available: true, images: ["Today18.jpeg"] },
    { id: 19, location: "Philadelphia", price: "$210", rooms: 4, available: false, images: ["Today19.jpeg"] },
    { id: 20, location: "Houston", price: "$140", rooms: 2, available: true, images: ["Today20.jpeg"] },
  ];

  return (
    <div className="bg-gray-100 p-9 m-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {islands.map((island) => (
          <div
            key={island.id}
            className="bg-white border border-gray-300 rounded-lg shadow-md w-[350px] h-[450px] flex flex-col"
          >
            {/* Image Section */}
            <div className="w-full h-[200px]">
              <img
                src={island.images[0]} // Accessing the first image in the array
                alt={island.location}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Section */}
            <div className="flex-grow p-2 text-center">
              <h2 className="text-sm font-bold text-gray-800">{island.location}</h2>
              <p className="text-xs text-gray-600">Price: {island.price}</p>
              <p className="text-xs text-gray-600">Rooms: {island.rooms}</p>
            </div>

            {/* Availability and Booking Section */}
            <div className="flex justify-center items-center p-2 mt-auto">
              {island.available ? (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Book Now
                </button>
              ) : (
                <p className="text-red-500 text-sm">Not Available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
