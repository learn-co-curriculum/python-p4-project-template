import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PortCard from "./Portcard";

function Passenger() {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/ports")
      .then((res) => res.json())
      .then((data) => setPorts(data))
      .catch((error) => console.error("Error fetching ports:", error));
  }, []);

  return (
    <div>
      <Navbar />
      <h1 id="header">Port List</h1>
      <div className="ports-container">
        {ports.map((port) => (
          <PortCard key={port.id} port={port} category="passenger" />
        ))}
      </div>
    </div>
  );
}

export default Passenger;
