export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const userData = await response.json();
      return userData; // Return the user data
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error('An error occurred while logging in');
  }
};

export const getData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/count');  // Endpoint for all data
    if (!response.ok) {  // Check if the response status is OK
      throw new Error('Failed to fetch all data')
    }
    const allData = await response.json();  // Parse the JSON response
    return allData;  // Return the fetched data (you can use it in your UI)
  } catch (error) {
    console.error('Error fetching all data:', error);
    return { status: 'error', message: 'Failed to fetch all data' };  // Handle error
  }
};
