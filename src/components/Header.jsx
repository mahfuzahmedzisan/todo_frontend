import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-8 mb-8">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
            AuthApp
          </Link>
          {user && (
            <>
              <Link to="/users" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Users
              </Link>
              <Link to="/todos" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Todos
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-sm font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
