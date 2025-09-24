import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Todos = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Todos Page</h1>
        <p className="text-gray-600 mb-6">This is another protected page for {user?.name}.</p>
        <div className="flex justify-center space-x-4">
          <Link to="/users" className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors duration-300 shadow-md">
            Go to Users
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todos;
