import React from "react";
import HomeNav from "../components/Navbar/HomeNav";
import "../style.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HomeNav />
      <section className="landing-section">
        <div className="landing-content">
        <h1 className="landing-title" style={{ color: 'black' }}>Welcome to Online Food Menu</h1>

          <p>
            Explore a world of culinary delights with our Food Menu app. Whether
            you're a food enthusiast or a restaurant owner, our platform is
            designed to enhance your dining experience. Discover a diverse range
            of dishes, from savory classics to innovative creations, curated to
            satisfy every palate. Join us on a gastronomic journey where flavor
            meets convenience, and let Food Menu redefine the way you experience
            food.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
