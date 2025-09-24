import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Users = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mb-6">This is a protected page. Your user details are loaded from the backend.</p>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
          <p className="text-left text-gray-700">
            <strong>User ID:</strong> {user.id}
          </p>
          <p className="text-left text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-left text-gray-700">
            <strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/todos" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md">
            Go to Todos
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

export default Users;
