import axios from 'axios';

axios.defaults.withCredentials = true; // For cookies
axios.defaults.baseURL = 'http://localhost:2000';
axios.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('authToken='))
    ?.split('=')[1]; // Get token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
