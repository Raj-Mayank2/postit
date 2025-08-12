import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/Login';
import SignupForm from './components/Signup';
import PostGeneratorUI from './components/post-generator-ui';

// Header Component with Gradient Logo
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
  <Link to="/" className="text-3xl font-extrabold flex items-center select-none">
    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
      Post
    </span>
    <span className="ml-2 bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
      It
    </span>
  </Link>

  <nav>
    {user ? (
      <div className="flex items-center space-x-6">
        <span className="text-gray-800 font-semibold tracking-wide">
          Welcome, <span className="capitalize">{user.name}</span>
        </span>
        <button
          onClick={logout}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    ) : (
      <div className="flex space-x-6">
        <Link
          to="/login"
          className="text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="text-gray-700 font-medium hover:text-indigo-600 transition-colors duration-300"
        >
          Signup
        </Link>
      </div>
    )}
  </nav>
</header>

  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-gray-100 min-h-screen">
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />

            {/* Protected route for the main app content */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<PostGeneratorUI />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
