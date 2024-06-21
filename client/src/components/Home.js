import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Home</h1>
          <p>Your journey to a new home begins here</p>
          <Link to="/properties" className="hero-button">Explore Properties</Link>
        </div>
      </section>

      <section className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to RealEstate, your trusted partner in finding the perfect home. 
            With years of experience in the real estate market, we pride ourselves on 
            offering personalized services to meet your unique needs. Whether you are 
            looking to buy, sell, or rent, our team of dedicated professionals is here 
            to assist you every step of the way.
          </p>
          <p>
            Our mission is to make the process of finding your dream home as smooth and 
            enjoyable as possible. We offer a wide range of properties to suit different 
            preferences and budgets. From luxurious apartments in the city to cozy cottages 
            in the countryside, we have something for everyone.
          </p>
          <p>
            We believe in transparency, integrity, and customer satisfaction. Our team 
            is committed to providing you with the best service and the latest market 
            insights to help you make informed decisions. Thank you for choosing RealEstate.
            We look forward to helping you find your dream home.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 RealEstate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
