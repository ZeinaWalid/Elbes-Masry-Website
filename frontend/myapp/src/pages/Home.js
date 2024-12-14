import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState({
    brandName: '',
    gender: '',
    size: '',
    price: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    try {
      const filteredQuery = Object.keys(searchQuery)
        .filter((key) => searchQuery[key] !== '') // Remove empty fields
        .reduce((obj, key) => {
          obj[key] = searchQuery[key];
          return obj;
        }, {});
  
      const response = await axios.get('http://localhost:2000/products/search', {
        params: filteredQuery, // Send only non-empty fields
      });
      setSearchResults(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch search results. Please try again.');
      console.error('Search error:', error);
    }
  };
  
  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">Elbes-Masry</div>
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>
        <div className="search-bar">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery.brandName}
              onChange={(e) => setSearchQuery({ ...searchQuery, brandName: e.target.value })}
            />
            <button onClick={handleSearch}>🔍</button>
          </div>
        </div>
      </header>
      <main className="hero-section">
        <div className="hero-text">
          <h1>Crafted with Elegance</h1>
          <p>
            Explore our exclusive collection designed for the modern you. Elegant, timeless, and always stylish.
          </p>
        </div>
        <div className="hero-results">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {searchResults.length > 0 ? (
            <ul className="results-list">
              {searchResults.map((item) => (
                <li key={item.PRODUCT_ID}>
                  <h3>{item.PRODUCT_NAME}</h3>
                  <p>Brand: {item.BRAND_NAME}</p>
                  <p>Gender: {item.GENDER}</p>
                  <p>Size: {item.SIZE}</p>
                  <p>Price: ${item.PRICE}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
