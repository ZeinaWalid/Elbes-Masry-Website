import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Cart.css';

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:2000/products/search', {
          withCredentials: true,
        });
        setProducts(response.data || []);
      } catch (error) {
        setErrorMessage('Failed to fetch products.');
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        'http://localhost:2000/cart',
        {
          PRODUCT_ID: productId,
          QUANTITY: 1, // Default quantity
        },
        { withCredentials: true }
      );
      setCartMessage(response.data); // Server response message
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add product to cart. Please check availability.');
      setCartMessage('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout'); // Redirect to the Checkout page
  };

  return (
    <div className="cart-container">
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
      <main className="cart-main">
        <h1 className="cart-title">Available Products</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {cartMessage && <p className="success-message">{cartMessage}</p>}
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.PRODUCT_ID} className="product-card">
                <h3>{product.PRODUCT_NAME}</h3>
                <p>{product.DESCRIPTION}</p>
                <p>Price: ${product.PRICE}</p>
                <p>Size: {product.SIZE}</p>
                <p>Stock: {product.STOCK}</p>
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product.PRODUCT_ID)}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
        <button className="checkout-button" onClick={handleCheckout}>
          Go to Checkout
        </button>
      </main>
    </div>
  );
};

export default Cart;
