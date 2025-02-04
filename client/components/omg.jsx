'use client'
import React, { useState } from 'react';

const Omg = () => {
  const cardData = [
    { id: 1, location: 'New York', price: '$150', rooms: 2, images: ['Today1.jpeg', 'Today1_2.jpeg', 'Today1_3.jpeg', 'Today_1.jpeg'] },
    { id: 2, location: 'Los Angeles', price: '$200', rooms: 3, images: ['Today2.jpeg', 'Today2_2.jpeg', 'Today2_3.jpeg'] },
    { id: 3, location: 'San Francisco', price: '$180', rooms: 1, images: ['Today3.jpeg', 'Today3_2.jpeg', 'Today3_3.jpeg'] },
    { id: 4, location: 'Miami', price: '$170', rooms: 2, images: ['Today4.jpeg', 'Today4_2.jpeg', 'Today4_3.jpeg'] },
    { id: 5, location: 'Chicago', price: '$130', rooms: 4, images: ['Today5.jpeg', 'Today5_2.jpeg', 'Today5_3.jpeg'] },
    { id: 6, location: 'Austin', price: '$160', rooms: 2, images: ['Today6.jpeg', 'Today6_2.jpeg', 'Today6_3.jpeg'] },
    { id: 7, location: 'Seattle', price: '$210', rooms: 3, images: ['Today7.jpeg', 'Today7_2.jpeg', 'Today7_3.jpeg'] },
    { id: 8, location: 'Las Vegas', price: '$220', rooms: 5, images: ['Today8.jpeg', 'Today8_2.jpeg', 'Today8_3.jpeg'] },
    { id: 9, location: 'Denver', price: '$140', rooms: 2, images: ['Today9.jpeg', 'Today9_2.jpeg', 'Today9_3.jpeg'] },
    { id: 10, location: 'San Diego', price: '$190', rooms: 3, images: ['Today10.jpeg', 'Today10_2.jpeg', 'Today10_3.jpeg'] },
    { id: 11, location: 'Boston', price: '$230', rooms: 4, images: ['Today11.jpeg', 'Today11_2.jpeg', 'Today11_3.jpeg'] },
    { id: 12, location: 'Dallas', price: '$120', rooms: 1, images: ['Today12.jpeg', 'Today12_2.jpeg', 'Today12_3.jpeg'] },
    { id: 13, location: 'Phoenix', price: '$160', rooms: 3, images: ['Today13.jpeg', 'Today13_2.jpeg', 'Today13_3.jpeg'] },
    { id: 14, location: 'Portland', price: '$180', rooms: 2, images: ['Today14.jpeg', 'Today14_2.jpeg', 'Today14_3.jpeg'] },
    { id: 15, location: 'Orlando', price: '$150', rooms: 3, images: ['Today15.jpeg', 'Today15_2.jpeg', 'Today15_3.jpeg'] },
    { id: 16, location: 'Nashville', price: '$170', rooms: 4, images: ['Today16.jpeg', 'Today16_2.jpeg', 'Today16_3.jpeg'] },
    { id: 17, location: 'Washington DC', price: '$250', rooms: 5, images: ['Today17.jpeg', 'Today17_2.jpeg', 'Today17_3.jpeg'] },
    { id: 18, location: 'Atlanta', price: '$190', rooms: 3, images: ['Today18.jpeg', 'Today18_2.jpeg', 'Today18_3.jpeg'] },
    { id: 19, location: 'Philadelphia', price: '$210', rooms: 4, images: ['Today19.jpeg', 'Today19_2.jpeg', 'Today19_3.jpeg'] },
    { id: 20, location: 'Houston', price: '$140', rooms: 2, images: ['Today20.jpeg', 'Today20_2.jpeg', 'Today20_3.jpeg'] },
  ];

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cardData.map((card) => (
          <CarouselCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

const CarouselCard = ({ card }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === card.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? card.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Image Carousel */}
      <div className="relative group h-52 w-full">
        <img
          src={card.images[currentIndex]}
          alt={card.location}
          className="w-full h-full object-cover"
        />
        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          ←
        </button>
        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          →
        </button>
      </div>

      {/* Text Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.location}</h2>
        <p className="text-lg text-gray-600 mb-2">Price per night: {card.price}</p>
        <p className="text-lg text-gray-600">Rooms: {card.rooms}</p>
      </div>
    </div>
  );
};

export default Omg;
