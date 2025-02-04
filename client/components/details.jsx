import React from 'react';

const Details = () => {
  return (
    <div className='max-w-screen-lg mx-auto p-6'>
      <div className='flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg overflow-hidden'>
        
        {/* Image Section */}
        <div className='w-full md:w-1/2 h-80 bg-gray-300'>
          <img
            src='13.jpeg' // Replace with your image URL
            alt='Service Experience'
            className='w-full h-full object-cover'
          />
        </div>

        {/* Text Section */}
        <div className='w-full md:w-1/2 p-8'>
          <h1 className='text-2xl font-semibold text-gray-800 mb-4'>
            Experience the Best Service That Will Make You Want to Return
          </h1>
          <p className='text-lg text-gray-600 mb-6'>
            Discover how our services stand out from the rest. We offer not just convenience but a premium experience tailored to your needs.
          </p>
          
          {/* Key Features */}
          <ul className='space-y-3'>
            <li className='flex items-center text-lg text-gray-700'>
              <span className='mr-3 text-green-500'>🚗</span> Reliable, fast, and hassle-free service.
            </li>
            <li className='flex items-center text-lg text-gray-700'>
              <span className='mr-3 text-green-500'>🏠</span> Stylish properties in the best locations.
            </li>
            <li className='flex items-center text-lg text-gray-700'>
              <span className='mr-3 text-green-500'>💳</span> Secure, flexible payment options for your peace of mind.
            </li>
          </ul>
          
          <p className='text-lg font-semibold text-gray-800 mt-6'>
            Join us and make every moment unforgettable. Book your next experience today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Details;
