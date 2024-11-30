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



export const getCount = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/count');
    if (!response.ok) {
      throw new Error('Failed to fetch all data')
    }
    const allData = await response.json();
    return allData;
  } catch (error) {
    console.error('Error fetching all data:', error);
    return { status: 'error', message: 'Failed to fetch all data' };
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

//getting users for adminDashboard usermanagement
export const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const users = await response.json();
      return users; // Return the list of users
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    throw new Error('An error occurred while fetching users');
  }
};

//adding a new user from admin dashboard user management
export const addUser = async (newUser) => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser), // newUser object with username, email, password, role, and role-specific details
    });

    if (response.ok) {
      const result = await response.json();
      return result; // Return the result or the new user data
    } else {
      const error = await response.json(); // Capture detailed error message from the server
      throw new Error(error.message || 'Failed to add user');
    }
  } catch (error) {
    throw new Error(`An error occurred while adding the user: ${error.message}`);
  }
};


//deleting user from admin dashboard user management
export const deleteUser = async (userId) => {
  try {
    const response = await fetch('http://localhost:5000/api/admin/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId,  // Send the userId in the headers
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result;  // Return the response if deletion was successful
    } else {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    throw new Error('An error occurred while deleting the user');
  }
};

