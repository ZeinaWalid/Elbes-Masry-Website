import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BusinessOwner.css';

const BusinessOwner = () => {
  const [brand, setBrand] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:2000/businessowner/dashboard', {
          withCredentials: true,
        });
        setBrand(response.data.brand);
        setProducts(response.data.products);
        setOrders(response.data.orders);
      } catch (error) {
        setErrorMessage('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="business-owner-container">
      <header className="navbar">
        <div className="logo">Elbes-Masry</div>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="/logout">Logout</a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="dashboard">
        {/* <section className="brand-details">
          <h2>{brand.PRODUCT_NAME}</h2>
          <p>{brand.DESCRIPTION}</p>
        </section> */}
        <section className="products">
          <h2>Products</h2>
          {products.length > 0 ? (
            <ul>
              {products.map((product) => (
                <li key={product.PRODUCT_ID}>
                  <h3>{product.PRODUCT_NAME}</h3>
                  <p>Price: ${product.PRICE}</p>
                  <p>Size: {product.SIZE}</p>
                  <p>Stock: {product.STOCK}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products available.</p>
          )}
        </section>
        <section className="orders">
          <h2>Orders</h2>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.ORDER_ID}>
                  <h3>{order.PRODUCT_NAME}</h3>
                  <p>Quantity: {order.QUANTITY}</p>
                  <p>Customer: {order.FIRST_NAME} {order.LAST_NAME}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders available.</p>
          )}
        </section>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </main>
    </div>
  );
};

export default BusinessOwner;
