import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import axios from 'axios';
import '../styles/Register.css';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added toggle state for password visibility

  const navigate = useNavigate(); // Initializing navigate function

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setErrorMessage('Please select a role before registering.');
      return;
    }

    try {
      const registerData =
        selectedRole === 'BusinessOwner'
          ? { BUSINESS_USERNAME: username, PASSWORD: password, EMAIL: email, BRAND_NAME: businessName, BRAND_DESCRIPTION: businessDescription }
          : selectedRole === 'User'
          ? { USERNAME: username, PASSWORD: password, EMAIL: email, FIRST_NAME: firstName, LAST_NAME: lastName }
          : { USERNAME: username, PASSWORD: password, EMAIL: email };

      const response = await axios.post(
        `http://localhost:2000/${selectedRole.toLowerCase()}/register`,
        registerData,
        { withCredentials: true }
      );

      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful! You can now log in.');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Elbes-Masry Registration</h1>

        <div className="role-selection">
          <button className={`role-box ${selectedRole === 'BusinessOwner' ? 'selected' : ''}`} onClick={() => setSelectedRole('BusinessOwner')}>
            Business Owner
          </button>
          <button className={`role-box ${selectedRole === 'User' ? 'selected' : ''}`} onClick={() => setSelectedRole('User')}>
            User
          </button>
        </div>

        {selectedRole && (
          <form className="register-form" onSubmit={handleRegister}>
            <h2 className="form-title">{selectedRole} Registration</h2>

            {selectedRole === 'BusinessOwner' && (
              <>
                <div className="form-group">
                  <input type="text" className="input-field" placeholder="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" className="input-field" placeholder="Business Description" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} required />
                </div>
              </>
            )}

            {selectedRole === 'User' && (
              <>
                <div className="form-group">
                  <input type="text" className="input-field" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <input type="text" className="input-field" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </>
            )}

            <div className="form-group">
              <input type="text" className="input-field" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="form-group">
              <input type="email" className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-icon"
                >
                  {showPassword ? '👁️' : '🔒'}
                </span>
              </div>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">
                {successMessage}{' '}
                <span className="login-link" onClick={() => navigate('/login')}>
                  Now you can log in.
                </span>
              </p>
            )}

            <button type="submit" className="register-button">Register</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
