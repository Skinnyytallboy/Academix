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

export const fetchCourses = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/Acourse/existingCourses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const dataC = await response.json();
      return dataC;
    } else {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);  // Optionally log error
    throw new Error('An error occurred while fetching courses');
  }
};

export const fetchProfessors = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/Acourse/allProfessors', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const dataP = await response.json();
      return dataP;
    } else {
      throw new Error(`Failed to fetch professors: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);  // Optionally log error
    throw new Error('An error occurred while fetching professors');
  }
};

export const addCourseToDatabase = async (newCourse) => {
  try {
    const response = await fetch('http://localhost:5000/api/Acourse/addCourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCourse),
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add course');
    }
  } catch (error) {
    throw new Error('An error occurred while adding the course');
  }
};

export const deleteCourseFromDatabase = async (courseId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/Acourse/deleteCourse`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'courseid' : courseId,
      },
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to delete course');
    }
  } catch (error) {
    throw new Error('An error occurred while deleting the course');
  }
};

//functions for AssignStudents Admin dashboard
// you can use fetchCourses (func made above) to get the courses 
// if doesnt work ya koi issue tou sirf ik 
// new function yahan dalna backend par bana hua in assignStudentsRoute

//get all students
export const fetchAllStudents = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/assignStudents/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const students = await response.json();
      return students; // Return the list of students
    } else {
      throw new Error('Failed to fetch students');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching students: ${error.message}`);
  }
};

export const assignStudentsToCourse = async (courseId, studentIds) => {
  try {
    const response = await fetch('http://localhost:5000/api/assignStudents/assign-students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId, studentIds }),  //make sure to send the objects in this order
    });

    if (response.ok) {
      const result = await response.json();
      return result; // Return the success message and assigned data
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to assign students to the course');
    }
  } catch (error) {
    throw new Error(`An error occurred while assigning students: ${error.message}`);
  }
};

export const removeStudentFromCourse = async (courseId, studentId) => {
  try {
    const response = await fetch('http://localhost:5000/api/assignStudents/remove-student', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId, studentId }),
    });

    if (response.ok) {
      const result = await response.json();
      return result; // Return the success message
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove the student from the course');
    }
  } catch (error) {
    throw new Error(`An error occurred while removing the student: ${error.message}`);
  }
};
