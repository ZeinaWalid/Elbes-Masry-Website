import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';
import BusinessOwner from './pages/BusinessOwner';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/login" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/register" element={<RegisterPage />} /> {/* Register Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Admin Dashboard */}
        <Route path="/businessowner/dashboard" element={<BusinessOwner />} /> {/* Business Owner Dashboard */}
        <Route path="/cart" element={<Cart />} /> {/* Cart Page */}
        <Route path="/checkout" element={<Checkout />} /> {/* Checkout Page */}
        <Route path="/orders" element={<Orders />} /> {/* Order Page */}
      </Routes>
    </Router>
  );
}

export default App;
