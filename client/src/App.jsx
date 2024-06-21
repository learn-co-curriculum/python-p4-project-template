import React, { useState, createContext, useContext, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Spacecrafts from './components/Spacecrafts';
import NewSpacecraftForm from './components/NewSpaceCraftForm';
import Mission from './components/Mission';
import CelestialBody from './components/CelestialBody';
import Home from './components/Home';
import Player from './components/Player';
import Login from './components/Login';
import Signup from './components/Signup';
import './components/spacecrafts.css';
import './components/Mission.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

const SpaceContext = createContext();
export const useSpace = () => useContext(SpaceContext);

function App() {
  const [spacecrafts, setSpacecrafts] = useState([
    {
      id: "1",
      name: "Odyssey",
      speed: 25000,
      fuel_log: 12500,
      equipment: "Long-range scanner, Cryogenic stasis pods, Sample collection arm",
      image: "https://i.pinimg.com/originals/f9/11/14/f911146d86d4d343c816083fefef2b55.jpg"
    },
    {
      id: "2",
      name: "Voyager II",
      speed: 32000,
      fuel_log: 9800,
      equipment: "High-resolution camera, Radiation shield, Interstellar radio",
      image: "https://cdn.mos.cms.futurecdn.net/fbWjohVvdk7ekhuoP5vAk7.jpg"
    },
    {
      id: "3",
      name: "Aurora",
      speed: 45000,
      fuel_log: 28000,
      equipment: "Plasma drive, Nanobot repair system, Quantum entanglement communicator",
      image: "https://aspiringyouths.com/wp-content/uploads/2019/10/Image-of-Spacecraft-or-Satellite.jpg"
    },
    {
      id: "4",
      name: "Pioneer",
      speed: 18000,
      fuel_log: 6000,
      equipment: "Solar panels, Asteroid mining laser, Hydroponic garden",
      image: "https://www.businessinsider.in/photo/77273053/the-astronauts-who-flew-spacexs-crew-dragon-to-the-space-station-are-set-to-come-home-on-sunday-watch-their-fiery-return-flight-live-.jpg?imgsize=216123"
    },
    {
      id: "5",
      name: "Galactica",
      speed: 38000,
      fuel_log: 15000,
      equipment: "Hyperspace engine, Drone fleet, Bio-dome",
      image: "https://i.pinimg.com/originals/41/14/f3/4114f3fec8e59ed9b581f005c5ebbff1.jpg"
    }
  ]);

  const [celestialBodies, setCelestialBodies] = useState(() => {
    const saved = localStorage.getItem("celestialBodies");
    return saved ? JSON.parse(saved) : [];
  });

  const [totalDistance, setTotalDistance] = useState(() => {
    const saved = localStorage.getItem("totalDistance");
    return saved ? JSON.parse(saved) : 0;
  });

  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem("destinations");
    return saved ? JSON.parse(saved) : '';
  });

  useEffect(() => {
    const fetchSpacecrafts = async () => {
      try {
        const response = await fetch('http://localhost:5555/spacecrafts');
        const data = await response.json();
        setSpacecrafts(data);
      } catch (error) {
        console.error('Error fetching spacecrafts:', error);
      }
    };

    fetchSpacecrafts();
  }, []);

  useEffect(() => {
    const fetchCelestialBodies = async () => {
      try {
        const response = await fetch('http://localhost:5555/celestial_bodies');
        const data = await response.json();
        setCelestialBodies(data);
      } catch (error) {
        console.error('Error fetching celestial bodies:', error);
      }
    };

    fetchCelestialBodies();
  }, []);

  useEffect(() => {
    localStorage.setItem("celestialBodies", JSON.stringify(celestialBodies));
  }, [celestialBodies]);

  useEffect(() => {
    localStorage.setItem("totalDistance", JSON.stringify(totalDistance));
  }, [totalDistance]);

  useEffect(() => {
    localStorage.setItem("destinations", JSON.stringify(destinations));
  }, [destinations]);

  const toggleCelestialBody = (body) => {
    const exists = celestialBodies.find(item => item.id === body.id);
    const updatedCelestialBodies = exists ? celestialBodies.filter(item => item.id !== body.id) : [...celestialBodies, body];
    setCelestialBodies(updatedCelestialBodies);

    // Update total distance and destinations
    const updatedTotalDistance = updatedCelestialBodies.reduce((acc, curr) => acc + parseFloat(curr.distance), 0);
    setTotalDistance(updatedTotalDistance);

    const updatedDestinations = updatedCelestialBodies.map(body => body.name).join(', ');
    setDestinations(updatedDestinations);
  };

  return (
    <SpaceContext.Provider value={{ celestialBodies, totalDistance, destinations, spacecrafts, setCelestialBodies, setTotalDistance, setDestinations, toggleCelestialBody }}>
      <div className="App">
        <Navbar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/player" element={<Player />} />
            <Route path="/destinations" element={<CelestialBody />} />
            <Route path="/missions" element={<Mission />} />
            <Route path="/spacecrafts" element={<Spacecrafts />} />
            <Route path="/spacecrafts/new" element={<NewSpacecraftForm />} />
          </Routes>
        </Container>
      </div>
    </SpaceContext.Provider>
  );
}

export default App;
