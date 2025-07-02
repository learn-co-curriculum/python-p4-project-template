import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../services/api";

const StayList = () => {
  const [stays, setStays] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true);
        const data = await apiCall("/stays");
        setStays(data);
        setError(null);
      } catch (err) {
        console.error("Network error:", err);
        // Fallback to demo data when backend is unavailable or has errors
        const demoStays = [
          {
            id: 1,
            title: "Cozy Mountain Cabin",
            location: "Mount Kenya, Nyeri",
            price: 12000,
            description: "Perfect getaway in the mountains",
          },
          {
            id: 2,
            title: "Modern City Apartment",
            location: "Westlands, Nairobi",
            price: 18000,
            description: "Stylish apartment in the heart of the city",
          },
          {
            id: 3,
            title: "Beachfront Villa",
            location: "Diani Beach, Mombasa",
            price: 25000,
            description: "Luxury villa with ocean views",
          },
        ];
        setStays(demoStays);

        // Check error type and provide appropriate message
        if (err.message.includes("500")) {
          setError(
            "🚧 Demo Mode: Backend server is running but needs database setup. Showing sample data. To fix: cd staybuddy/server && python app.py (ensure database is initialized).",
          );
        } else {
          setError(
            "🚧 Demo Mode: Backend server connection issue. Showing sample data. To start the backend server, run: cd staybuddy/server && python app.py",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Find Your Perfect Stay</h1>
            <p className="page-subtitle">Loading amazing places...</p>
          </div>
          <div className="text-center">
            <div style={{ fontSize: "2rem" }}>🏠</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Find Your Perfect Stay</h1>
            <p className="page-subtitle">
              Discover unique accommodations around the world
            </p>
          </div>
          <div
            className={error.includes("Demo Mode") ? "demo-notice" : "error"}
          >
            {error.includes("Demo Mode") ? (
              <>
                <strong>ℹ️ Demo Mode</strong>
                <br />
                {error.replace("🚧 Demo Mode: ", "")}
              </>
            ) : (
              <>
                <strong>⚠️ Connection Error</strong>
                <br />
                {error}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Find Your Perfect Stay</h1>
          <p className="page-subtitle">
            Discover unique accommodations around the world
          </p>
        </div>

        {stays.length === 0 ? (
          <div className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: "24px" }}>🏠</div>
            <h3>No stays available yet</h3>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "32px",
              }}
            >
              Be the first to list your amazing space!
            </p>
            <Link to="/host/new" className="btn btn-primary">
              List Your Space
            </Link>
          </div>
        ) : (
          <div className="stay-grid">
            {stays.map((stay) => (
              <Link
                key={stay.id}
                to={`/stays/${stay.id}`}
                className="stay-card"
              >
                <div className="stay-image">
                  {stay.photos && stay.photos.length > 0 ? (
                    <img
                      src={stay.photos[0].url}
                      alt={stay.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="stay-image-fallback"
                    style={{
                      display:
                        stay.photos && stay.photos.length > 0 ? "none" : "flex",
                    }}
                  >
                    🏠
                  </div>
                  {stay.photos && stay.photos.length > 1 && (
                    <div className="photo-count-badge">
                      +{stay.photos.length - 1}
                    </div>
                  )}
                </div>
                <div className="stay-content">
                  <h3 className="stay-title">{stay.title}</h3>
                  <div className="stay-location">📍 {stay.location}</div>
                  {stay.description && (
                    <div className="stay-description">{stay.description}</div>
                  )}
                  <div className="stay-price">
                    KSH {stay.price}
                    <span className="stay-price-unit">/night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StayList;
