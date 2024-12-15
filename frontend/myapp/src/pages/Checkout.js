import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:2000/show/cart', {
          withCredentials: true,
        });
        setCartItems(response.data || []);
      } catch (error) {
        setErrorMessage('Failed to fetch cart items.');
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (cartId) => {
    try {
      const response = await axios.delete(`http://localhost:2000/cart/${cartId}`, {
        withCredentials: true,
      });
      setSuccessMessage(response.data);
      setErrorMessage('');

      // Refresh the cart items after deletion
      setCartItems((prevItems) => prevItems.filter((item) => item.CART_ID !== cartId));
    } catch (error) {
      setErrorMessage('Failed to remove item from cart.');
      setSuccessMessage('');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axios.post('http://localhost:2000/checkout', {}, {
        withCredentials: true,
      });
      setSuccessMessage('Order placed successfully!'); // Display success message
      setErrorMessage('');
      setCartItems([]); // Clear the cart
    } catch (error) {
      setErrorMessage('Failed to place order. Please try again.');
      setSuccessMessage('');
    }
  };

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
        <h1 className="checkout-title">My Cart</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="cart-items-grid">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.CART_ID} className="cart-item-card">
                <h3>{item.PRODUCT_NAME}</h3>
                <p>{item.DESCRIPTION}</p>
                <p>Price: ${item.PRICE}</p>
                <p>Quantity: {item.QUANTITY}</p>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(item.CART_ID)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No items in your cart.</p>
          )}
        </div>
        {/* Order Button */}
        {cartItems.length > 0 && (
          <button className="remove-item-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        )}
      </main>
    </div>
  );
};

export default Checkout;
