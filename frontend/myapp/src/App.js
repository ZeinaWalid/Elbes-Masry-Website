<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
=======
>>>>>>> Stashed changes
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Import the Home component
import LoginPage from './pages/Login'; // Import the Login component
import RegisterPage from './pages/Register'; // Import the Register component
<<<<<<< Updated upstream
import Dashboard from './pages/Dashboard'; // Import the Admin Dashboard component
import BusinessOwner from './pages/BusinessOwner'; // Import the BusinessOwner component
=======
//import Dashboard from './pages/Dashboard'; // Import the Admin Dashboard component
import BusinessOwner from './pages/BusinessOwner'; // Import the BusinessOwner component
>>>>>>> Stashed changes
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/register" element={<RegisterPage />} /> {/* Register Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Admin Dashboard */}
        <Route path="/businessowner/dashboard" element={<BusinessOwner />} /> {/* Business Owner Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;
