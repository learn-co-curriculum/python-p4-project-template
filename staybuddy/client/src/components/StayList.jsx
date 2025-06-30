import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../services/api";

const StayList = () => {
  const [stays, setStays] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStays = async () => {
      try {
        const data = await apiCall("/stays");
        setStays(data);
        setError(null);
      } catch (err) {
        console.error("Network error:", err);
        setError(
          "Unable to load stays. Please check if the backend server is running.",
        );
      }
    };

    fetchStays();
  }, []);

  return (
    <div>
      <h2>All Stays</h2>
      {error && (
        <div style={{ color: "red", padding: "10px", margin: "10px 0" }}>
          {error}
        </div>
      )}
      <ul>
        {stays.map((stay) => (
          <li key={stay.id}>
            <Link to={`/stays/${stay.id}`}>
              <strong>{stay.title}</strong> — {stay.location} — ${stay.price}
              /night
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StayList;
