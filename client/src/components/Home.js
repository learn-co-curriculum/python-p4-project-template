import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";

function Home({ user }) {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>Welcome to FreightX</h1>
        <p>Your gateway to global logistics</p>
        <Link to="/ports" className="cta-button">
          Explore Our Ports
        </Link>
      </header>

      <section className="info-section">
        <div className="info-card">
          <img
            src="https://i.pinimg.com/564x/15/e6/ef/15e6efdbcc393a442a894ca291b6d40a.jpg"
            alt="Who we are"
          />
          <h2>Who are we?</h2>
          <p>
            FreightX is your seamless platform for sending and receiving goods,
            as well as booking passenger ships between global destinations.
            Experience our cutting-edge logistics solutions.
          </p>
        </div>

        <div className="info-card">
          <img
            src="https://i.pinimg.com/564x/fb/48/98/fb4898145cf39ff6e9c75bad1e062ec0.jpg"
            alt="Online bookings"
          />
          <h2>Online Bookings</h2>
          <p>
            Book tickets and plan cargo transportation from the comfort of your
            home. We adapt to change, bringing convenience to your fingertips.
          </p>
        </div>

        <div className="info-card">
          <img
            src="https://i.pinimg.com/564x/d5/a5/54/d5a55403bfc45d54f2fe7763b923cf40.jpg"
            alt="Future plans"
          />
          <h2>Future Plans</h2>
          <p>
            We're constantly improving our services. Soon, we'll launch an aero
            wing, making it even easier for our customers to commute globally.
          </p>
        </div>
      </section>

      <section className="ports-section">
        <h2>Discover Our Global Network</h2>
        <p>
          Click on the Explore Our Ports Button to view a list of our
          operational ports worldwide.
        </p>
      </section>
    </div>
  );
}

export default Home;
