// api.js
import axios from 'axios';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/api/login', { email, password }); // Replace with your backend endpoint
    if (response.data) {
      return response.data; // Assuming your backend sends user data on successful login
    } else {
      return null; // Return null for invalid credentials
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};
