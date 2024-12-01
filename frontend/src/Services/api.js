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
    const response = await fetch('http://localhost:5000/api/teacher/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : null,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher courses');
    }

    const data = await response.json();
    return data;
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
export const fetchCoursesAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/assignStudents/courses', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      return await response.json(); // Return the list of courses
    } else {
      throw new Error('Failed to fetch courses');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching courses: ${error.message}`);
  }
};

export const fetchStudentCourses = async (user) => {
  try {
    const response = await fetch('http://localhost:5000/api/student/courses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : user,
      },
    });
    const responseText = await response.text();
    if (response.ok) {
      const data = JSON.parse(responseText);
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error('Failed to fetch available courses');
      }
    } else {
      throw new Error('Failed to fetch student courses');
    }
  } catch (error) {
    throw new Error('An error occurred while fetching student courses');
  }
};

export const fetchNotSubmittedAssignments = async (user) => {
  try {
    const response = await fetch('http://localhost:5000/api/student/pendingAssignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : user,
      },
    });
    const responseText = await response.text();
    if (response.ok) {
      const data = JSON.parse(responseText);
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error('Failed to fetch pending assignments');
      }
    }
  } catch (error) {
    throw new Error('An error occurred while fetching assignments');
  }
};

export const submitStudentAssignment = async (assignmentData) => {
  try {
    const response = await fetch('http://localhost:5000/api/student/submitAssignment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
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

export const fetchAllStudentAssignments = async (user) => {
  try {
    const response = await fetch('http://localhost:5000/api/student/fetchAllStudentAssignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : user,
      },
    });
    const responseText = await response.text();
    if (response.ok) {
      const data = JSON.parse(responseText);
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error('Failed to fetch student assignments');
      }
    }
  }
  catch (error) {
    throw new Error('An error occurred while fetching student assignments');
  }
};

export const fetchAssignmentDetails = async (user) => {
  try {
    const response = await fetch('http://localhost:5000/api/student/fetchAssignmentDetails', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user-id': localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).userId : user,
      }
    });
    const responseText = await response.text();
    if (response.ok) {
      const data = JSON.parse(responseText);
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error('Failed to fetch assignment details');
      }
    }
  }
  catch (error) {
    throw new Error('An error occurred while fetching assignment details');
  }
};

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

export const assignStudentsToCourse = async ({ courseId, studentIds }) => {
  try {
    const response = await fetch('http://localhost:5000/api/assignStudents/assign-students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ courseId, studentIds }),
    });
    console.log('Request body assignment:', { courseId, studentIds });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit assignment');
    }
  } catch (error) {
    console.error('Submission error:', error);
    throw new Error('An error occurred while submitting the assignment');
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

//functions for gradeSubmission in Professor dashboard
// Fetch all Courses
export const fetchCoursesProf = async () => {
  try {
    console.log('Fetching courses...');
    const response = await fetch('http://localhost:5000/api/gradeSubmission/courses', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const datacourses = await response.json();
      return datacourses;  // Return the courses array
    } else if (response.status === 204) {
      return [];  // Return an empty array if no courses are found
    } else {
      throw new Error('Failed to fetch courses');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching courses: ${error.message}`);
  }
};



// Function to fetch assignments for a given course ID
export const fetchAssignments = async (courseId) => {
  try {
    const response = await fetch('http://localhost:5000/api/gradeSubmission/assignments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'courseId': courseId, // Pass the course ID in the headers
      },
    });

    if (response.ok) {
      return await response.json(); // Return the list of assignments
    } else {
      throw new Error('Failed to fetch assignments');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching assignments: ${error.message}`);
  }
};

// Function to fetch submissions for a given assignment ID
export const fetchSubmissions = async (assignmentId) => {
  try {
    const response = await fetch('http://localhost:5000/api/gradeSubmission/submissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'assignmentId': assignmentId, // Pass the assignment ID in the headers
      },
    });

    if (response.ok) {
      return await response.json(); // Return the list of submissions
    } else {
      throw new Error('Failed to fetch submissions');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching submissions: ${error.message}`);
  }
};

// Function to update or add a grade for a submission
export const submitGrade = async (submissionId, teacherId, grade, feedback) => {
  try {
    const response = await fetch('http://localhost:5000/api/gradeSubmission/grade', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ submissionId, teacherId, grade, feedback }),
    });

    if (response.ok) {
      return await response.json(); // Return a success message
    } else {
      throw new Error('Failed to submit grade');
    }
  } catch (error) {
    throw new Error(`An error occurred while submitting the grade: ${error.message}`);
  }
};


//function for studentGrades in Professor dashboard
//use fetchCoursesProf for getting courses
export const fetchFinalGrades = async (courseId) => {
  try {
    const response = await fetch('http://localhost:5000/api/studentGrades/Finalgrades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'courseid': courseId, // Send the courseId in headers
      },
    });

    if (response.ok) {
      const grades = await response.json();
      return grades; // Return the final grades
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch final grades');
    }
  } catch (error) {
    throw new Error(`An error occurred while fetching final grades: ${error.message}`);
  }
};
