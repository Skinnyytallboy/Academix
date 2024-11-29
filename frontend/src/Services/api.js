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

export const getTeacherCourses = async () => {
  try {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user || !user.userId) {
      throw new Error('No user or userId found. Please log in first.');
    }

    const teacherId = user.userId; // Extract the teacherId

    // Make a request to the server with teacherId
    const response = await fetch('http://localhost:5000/api/teacher/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'teacherId': teacherId, // Send teacherId in headers
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher courses');
    }

    const data = await response.json();
    return data; // Return the fetched courses
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    return { status: 'error', message: error.message }; // Handle error
  }
};
