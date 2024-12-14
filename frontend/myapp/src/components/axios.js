// Example usage in a component
import axios from '../axios'; // Adjust the path based on the location of the file

const fetchData = async () => {
  try {
    const response = await axios.get('/businessowner/dashboard');
    console.log('Dashboard data:', response.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

useEffect(() => {
  fetchData();
}, []);
