import React, { useState, useEffect, createContext, useContext } from "react"; 
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import PropertyDetails from "../pages/PropertyDetails";
import OwnerDashboard from "../pages/OwnerDashboard";
import UserDashboard from "../pages/UserDashboard";
import AuthPage from "../pages/AuthPage"; // ✅ Import AuthPage
import Footer from './Footer'
// Create Authentication Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<div className="container mx-auto p-4"><PropertyDetails /></div>} />
          
          {/* Protected Routes */}
          {user && user.user_type === 'owner' && (
            <Route path="/owner-dashboard" element={<div className="container mx-auto p-4" style={{ paddingTop: "80px" }}><OwnerDashboard /></div>} />
          )}
          
          {user && user.user_type === 'guest' && (
            <Route path="/user-dashboard" element={<div className="container mx-auto p-4" style={{ paddingTop: "80px" }}><UserDashboard /></div>} />
          )}
          
          {/* Auth route only for non-logged in users */}
          {!user && <Route path="/auth" element={<AuthPage />} />}
        </Routes>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;