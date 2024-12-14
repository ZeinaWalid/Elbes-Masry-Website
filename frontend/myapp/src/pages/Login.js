// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import background from '../styles/image.png';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessUsername, setBusinessUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setErrorMessage('Please select a role before logging in.');
      return;
    }

    try {
      const loginData =
        selectedRole === 'BusinessOwner'
          ? { BUSINESS_USERNAME: businessUsername, PASSWORD: password }
          : { USERNAME: username, PASSWORD: password };

      const response = await axios.post(
        `http://localhost:2000/${selectedRole.toLowerCase()}/login`,
        loginData,
        { withCredentials: true }
      );

      console.log('Login successful:', response.data);
      setSuccessMessage('Successful Login, Welcome back!');
      setErrorMessage(''); 
    } catch (error) {
      setErrorMessage('Invalid credentials, please try again');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        maxWidth: '450px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          color: '#4B2C20',
          textAlign: 'center',
          marginBottom: '20px'
        }}>Elbes-Masry Login</h1>

        <div className="role-selection" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className={`role-box ${selectedRole === 'Admin' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Admin')}
            style={{
              backgroundColor: '#FFB38E',
              borderRadius: '10px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Admin Login
          </button>
          <button
            className={`role-box ${selectedRole === 'Business Owner' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Business Owner')}
            style={{
              backgroundColor: '#FFCF9D',
              borderRadius: '10px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Business Owner Login
          </button>
          <button
            className={`role-box ${selectedRole === 'User' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('User')}
            style={{
              backgroundColor: '#FFDAB9',
              borderRadius: '10px',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            User Login
          </button>
        </div>

        {selectedRole && (
          <div className="login-form-container" style={{ marginTop: '20px' }}>
            <form className="login-form" onSubmit={handleLogin}>
              <h2 style={{ fontSize: '1.8rem', color: '#4B2C20', textAlign: 'center' }}>{selectedRole} Login</h2>

              {selectedRole === 'Business Owner' ? (
                <div className="form-group">
                  <input
                    type="text"
                    id="businessUsername"
                    className="input-field"
                    placeholder="Business Username"
                    value={businessUsername}
                    onChange={(e) => setBusinessUsername(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      marginBottom: '10px'
                    }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <input
                    type="text"
                    id="username"
                    className="input-field"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      marginBottom: '10px'
                    }}
                  />
                </div>
              )}

              <div className="form-group">
                <div className="password-wrapper" style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="input-field"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#AA6D34'
                    }}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </span>
                </div>
              </div>

              {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
              {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}

              <button
                type="submit"
                className="login-button"
                style={{
                  backgroundColor: '#AA6D34',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Login
              </button>
            </form>
          </div>
        )}

        <footer className="footer" style={{ marginTop: '20px', color: '#333', fontSize: '0.9rem' }}>&copy; 2024 Elbes-Masry. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default LoginPage
