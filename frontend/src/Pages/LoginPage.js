import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Services/supabaseClient';


const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear any previous errors

    try {
      // Authenticate user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If authentication fails, set the error message
        setErrorMessage('Incorrect email or password');
      } else {
        // Fetch the user role from Supabase database (assuming it's stored in 'profiles' table)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')  // Assuming 'profiles' table holds the user roles
          .select('role')
          .eq('id', data.user.id) // Match user ID to fetch the role
          .single();

        if (profileError || !profileData) {
          setErrorMessage('Unable to fetch user role. Contact support.');
        } else {
          // Set user and redirect based on role
          const user = {
            email: data.user.email,
            role: profileData.role, // Assume role is fetched from the database
          };
          setUser(user);

          // Navigate based on user role
          switch (user.role) {
            case 'administrator':
              navigate('/admin-dashboard');
              break;
            case 'professor':
              navigate('/professor-dashboard');
              break;
            case 'student':
              navigate('/student-dashboard');
              break;
            default:
              setErrorMessage('Invalid user role. Contact support.');
          }
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold mb-6">Login to Academix</h2>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/request-admin"
            className="text-sm text-blue-500 hover:underline"
          >
            New institute? Request an Admin account
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = ({ setUser }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   // Mocked user data
//   const users = [
//     { email: 'admin@academix.com', password: 'admin123', role: 'administrator' },
//     { email: 'professor@academix.com', password: 'prof123', role: 'professor' },
//     { email: 'student@academix.com', password: 'student123', role: 'student' },
//   ];

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Find user based on entered email and password
//     const user = users.find(
//       (u) => u.email === email && u.password === password
//     );

//     if (user) {
//       // Set the user state to the logged-in user
//       setUser(user);

//       // Navigate based on user role
//       switch (user.role) {
//         case 'administrator':
//           navigate('/admin-dashboard');
//           break;
//         case 'professor':
//           navigate('/professor-dashboard');
//           break;
//         case 'student':
//           navigate('/student-dashboard');
//           break;
//         default:
//           break;
//       }
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md bg-white p-8 border border-gray-300 rounded">
//         <h2 className="text-2xl font-bold mb-6">Login to Academix</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-bold mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//               placeholder="Enter your password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <a
//             href="/request-admin"
//             className="text-sm text-blue-500 hover:underline"
//           >
//             New institute? Request an Admin account
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
