import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BusinessOwner.css';

const BusinessOwner = () => {
  const [brand, setBrand] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
<<<<<<< Updated upstream
=======
  const [successMessage, setSuccessMessage] = useState('');
  const [newProduct, setNewProduct] = useState({
    PRODUCT_NAME: '',
    DESCRIPTION: '',
    PRICE: '',
    SIZE: '',
    STOCK: '',
    GENDER: '',
  });
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:2000/businessowner/dashboard', {
          withCredentials: true,
        });
<<<<<<< Updated upstream
        setBrand(response.data.brand);
        setProducts(response.data.products);
        setOrders(response.data.orders);
      } catch (error) {
        setErrorMessage('Failed to fetch dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);
=======
        setBrand(response.data.brand || {});
        setProducts(response.data.products || []);
        setOrders(response.data.orders || []);
        setErrorMessage('');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setErrorMessage('Failed to fetch dashboard data.');
      }
    };
  
    fetchDashboardData();
  }, []);
  

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:2000/business/products',
        {
          ...newProduct,
          BUSINESS_ID: brand.BUSINESS_ID, // Assuming the business ID is included in the brand details
        },
        { withCredentials: true }
      );

      setSuccessMessage('Product added successfully!');
      setErrorMessage('');
      setProducts((prevProducts) => [...prevProducts, response.data]); // Update the products list
      setNewProduct({ PRODUCT_NAME: '', DESCRIPTION: '', PRICE: '', SIZE: '', STOCK: '', GENDER: '' });
    } catch (error) {
      setErrorMessage('Failed to add product. Please try again.');
      setSuccessMessage('');
    }
  };
>>>>>>> Stashed changes

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
        <section className="brand-details">
          <h2>{brand.BRAND_NAME}</h2>
          <p>{brand.BRAND_DESCRIPTION}</p>
        </section>
<<<<<<< Updated upstream
=======

        <section className="add-product">
          <h2>Add Product</h2>
          <form onSubmit={handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.PRODUCT_NAME}
              onChange={(e) => setNewProduct({ ...newProduct, PRODUCT_NAME: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={newProduct.DESCRIPTION}
              onChange={(e) => setNewProduct({ ...newProduct, DESCRIPTION: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.PRICE}
              onChange={(e) => setNewProduct({ ...newProduct, PRICE: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Size"
              value={newProduct.SIZE}
              onChange={(e) => setNewProduct({ ...newProduct, SIZE: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.STOCK}
              onChange={(e) => setNewProduct({ ...newProduct, STOCK: e.target.value })}
              required
            />
            <select
              value={newProduct.GENDER}
              onChange={(e) => setNewProduct({ ...newProduct, GENDER: e.target.value })}
              required
            >
              <option value="">Select Gender</option>
              <option value="MEN">Men</option>
              <option value="WOMEN">Women</option>
              <option value="UNISEX">Unisex</option>
            </select>
            <button type="submit">Add Product</button>
          </form>
        </section>

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
        {successMessage && <p className="success-message">{successMessage}</p>}
>>>>>>> Stashed changes
      </main>
    </div>
  );
};

export default BusinessOwner;
