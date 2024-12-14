import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [businessOwners, setBusinessOwners] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2000/admin/dashboard', {
          withCredentials: true,
        });
        setUsers(response.data.users);
        setBusinessOwners(response.data.businessOwners);
        setLoading(false);
      } catch (error) {
        setErrorMessage('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:2000/${type.toLowerCase()}/delete/${id}`, {
        withCredentials: true,
      });
      if (type === 'User') {
        setUsers((prevUsers) => prevUsers.filter((user) => user.USER_ID !== id));
      } else {
        setBusinessOwners((prevOwners) =>
          prevOwners.filter((owner) => owner.BUSINESS_ID !== id)
        );
      }
      setSuccessMessage(`${type} deleted successfully.`);
    } catch (error) {
      setErrorMessage(`Failed to delete ${type}.`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <div>
            <div className="dashboard-section">
              <h2 className="dashboard-subtitle">Users</h2>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.USER_ID}>
                      <td>{user.USER_ID}</td>
                      <td>{user.USERNAME}</td>
                      <td>{user.EMAIL}</td>
                      <td>{`${user.FIRST_NAME} ${user.LAST_NAME}`}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleDelete('User', user.USER_ID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-section">
              <h2 className="dashboard-subtitle">Business Owners</h2>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Brand Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessOwners.map((owner) => (
                    <tr key={owner.BUSINESS_ID}>
                      <td>{owner.BUSINESS_ID}</td>
                      <td>{owner.BUSINESS_USERNAME}</td>
                      <td>{owner.EMAIL}</td>
                      <td>{owner.BRAND_NAME}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() =>
                            handleDelete('BusinessOwner', owner.BUSINESS_ID)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
