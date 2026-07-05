import React, { useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import UserPortal from "./UserPortal";
import NgoDashboard from "./NgoDashboard";
import NgoLogin from "./NgoLogin";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ngoToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-link">User Portal</Link>
        <Link to="/ngo" className="nav-link">NGO Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<UserPortal />} />
        
        <Route path="/ngo" element={ isAuthenticated ? (<NgoDashboard />) : (
          <NgoLogin onLoginSuccess={() => setIsAuthenticated(true)} />
        )} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;