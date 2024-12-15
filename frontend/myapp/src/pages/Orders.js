import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:2000/orders', {
          withCredentials: true,
        });
        setOrders(response.data || []);
      } catch (error) {
        setErrorMessage('Failed to fetch orders.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="checkout-container">
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
      <main className="checkout-main">
        <h1 className="checkout-title">My Orders</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="cart-items-grid">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.ID} className="cart-item-card">
                <h3>{order.PRODUCT_NAME}</h3>
                <p>{order.DESCRIPTION}</p>
                <p>Price: ${order.PRICE}</p>
                <p>Quantity: {order.QUANTITY}</p>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
