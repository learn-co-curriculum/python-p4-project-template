import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import PortCard from "./Portcard";
import "../css/ports.css";

function Ports({ user }) {
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/ports")
      .then((res) => res.json())
      .then((data) => setPorts(data))
      .catch((error) => console.error("Error fetching ports:", error));
  }, []);

  return (
    <div className="ports-page">
      <Navbar user={user} />
      <div className="container">
        <div className="content-wrapper">
          <h1 id="head">Port Hubs</h1>
          <p className="instruction">
            Select a port and click "View Ships" to see available vessels.
          </p>
          <div className="ports-container">
            {ports.map((port) => (
              <PortCard key={port.id} port={port} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ports;
