import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/shiplist.css"; // Import the CSS file

function Shiplist() {
  const { id } = useParams();
  const history = useHistory();
  const [portName, setPortName] = useState("");
  const [ships, setShips] = useState([]);
  const [filteredShips, setFilteredShips] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:5555/ports/${id}`)
        .then((res) => res.json())
        .then((portData) => {
          setPortName(portData.name); // Set the port name for the heading
        })
        .catch((error) => {
          console.error("Error fetching port:", error);
        });

      fetch(`http://127.0.0.1:5555/ports/${id}/ships`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched ships:", data);
          setShips(data);
          // Filter ships based on the current category, if any
          filterShips(data, category);
        })
        .catch((error) => {
          console.error("Error fetching ships:", error);
        });
    }
  }, [id, category]); // Add category to the dependency array

  const filterShips = (shipsList, category) => {
    if (category) {
      setFilteredShips(shipsList.filter((ship) => ship.category === category));
    } else {
      setFilteredShips(shipsList);
    }
  };

  const handleFilter = (newCategory) => {
    setCategory(newCategory);
    filterShips(ships, newCategory); // Apply filter based on the selected category
  };

  const handleViewShip = (shipId) => {
    history.push(`/ship/${shipId}`);
  };

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <h1 id="head">{portName} Ships</h1>
      <div className="filter-buttons">
        <button onClick={() => handleFilter("cargo")}>Cargo Ships</button>
        <button onClick={() => handleFilter("passenger")}>
          Passenger Ships
        </button>
        <button onClick={() => handleFilter(null)}>All Ships</button>
      </div>
      <div className="ships-container">
        <div className="ship-header">
          <span>Name</span>
          <span>Category</span>
          <span>Departure Port</span>
          <span>Arrival Port</span>
        </div>
        {filteredShips.map((ship) => (
          <div
            key={ship.id}
            className="ship-card"
            id={`ship-${ship.id}`}
            onClick={() => handleViewShip(ship.id)} // Navigate to ship details on click
          >
            <span>{ship.name}</span>
            <span
              className={
                ship.category === "cargo" ? "maroon-text" : "green-text"
              }
            >
              {ship.category}
            </span>
            <span className={ship.port_from.name === portName ? "titles" : ""}>
              {ship.port_from.name}
            </span>
            <span className={ship.port_to.name === portName ? "titles" : ""}>
              {ship.port_to.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shiplist;
