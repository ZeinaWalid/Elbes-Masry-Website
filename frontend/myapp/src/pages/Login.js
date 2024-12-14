import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [businessUsername, setBusinessUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  

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

      const endpoint =
        selectedRole === 'BusinessOwner'
          ? 'businessowner/login'
          : `${selectedRole.toLowerCase()}/login`;

      const response = await axios.post(
        `http://localhost:2000/${endpoint}`,
        loginData,
        { withCredentials: true }
      );

      setSuccessMessage('Successful Login, Welcome back!');
      setErrorMessage('');

      // Redirect based on role
      if (selectedRole === 'Admin') {
        navigate('/dashboard');
      } else if (selectedRole === 'BusinessOwner') {
        navigate('/businessowner/dashboard');
      } else {
        navigate('/'); // Redirect to homepage or user-specific page
      }
    } catch (error) {
      setErrorMessage('Invalid credentials, please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Elbes-Masry Login</h1>
        <div className="role-selection">
          <button
            className={`role-box ${selectedRole === 'Admin' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Admin')}
          >
            Admin Login
          </button>
          <button
            className={`role-box ${selectedRole === 'BusinessOwner' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('BusinessOwner')}
          >
            Business Owner Login
          </button>
          <button
            className={`role-box ${selectedRole === 'User' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('User')}
          >
            User Login
          </button>
        </div>

        {selectedRole && (
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleLogin}>
              <h2 className="role-title">{selectedRole} Login</h2>
              {selectedRole === 'BusinessOwner' ? (
                <input
                  type="text"
                  placeholder="Business Username"
                  value={businessUsername}
                  onChange={(e) => setBusinessUsername(e.target.value)}
                  required
                  className="input-field"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input-field"
                />
              )}
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-icon"
                >
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}
              <button type="submit" className="login-button">Login</button>
            </form>
          </div>
        )}
        <p className="register-link">
          Don't have an account?{' '}
          <a href="/register" className="register-link-text">
            Register here
          </a>
        </p>
        <footer className="footer">&copy; 2024 Elbes-Masry. All rights reserved.</footer>
      </div>
    </div>
  );
};

export default LoginPage;
