// frontend/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RequestAdminPage from './Pages/RequestAdminPage';
import AdminDashboard from './Pages/AdminDashboard';
import ProfessorDashboard from './Pages/ProfessorDashboard';
import StudentDashboard from './Pages/StudentDashboard';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  const PrivateRoute = ({ children, role }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (user.role !== role) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/request-admin" element={<RequestAdminPage />} />

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/professor-dashboard"
          element={
            <PrivateRoute role="professor">
              <ProfessorDashboard user={user} />
            </PrivateRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard user={user} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;



// old shit when i was using supabase
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from './Pages/LoginPage';
// import RequestAdminPage from './Pages/RequestAdminPage';
// import AdminDashboard from './Pages/AdminDashboard';
// import ProfessorDashboard from './Pages/ProfessorDashboard';
// import StudentDashboard from './Pages/StudentDashboard';
// function App() {
//   const [user, setUser] = useState(null); // This stores the logged-in user
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage setUser={setUser} />} />
//         <Route path="/request-admin" element={<RequestAdminPage />} />
//         <Route
//           path="/admin-dashboard"
//           element={<AdminDashboard user={user} />}
//         />
//         <Route
//           path="/professor-dashboard"
//           element={<ProfessorDashboard user={user} />}
//         />
//         <Route
//           path="/student-dashboard"
//           element={<StudentDashboard user={user} />}
//         />
//       </Routes>
//     </Router>
//   );
// }
// export default App;




// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
