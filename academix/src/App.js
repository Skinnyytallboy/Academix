import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RequestAdminPage from './Pages/RequestAdminPage';
import AdminDashboard from './Pages/AdminDashboard';
import ProfessorDashboard from './Pages/ProfessorDashboard';
import StudentDashboard from './Pages/StudentDashboard';

function App() {
  const [user, setUser] = useState(null); // This stores the logged-in user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route path="/request-admin" element={<RequestAdminPage />} />
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard user={user} />}
        />
        <Route
          path="/professor-dashboard"
          element={<ProfessorDashboard user={user} />}
        />
        <Route
          path="/student-dashboard"
          element={<StudentDashboard user={user} />}
        />
      </Routes>
    </Router>
  );
}

export default App;




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
