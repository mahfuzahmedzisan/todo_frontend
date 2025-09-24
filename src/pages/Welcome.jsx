import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the App</h1>
      <p className="text-gray-600 mb-6">
        This is the public welcome page. You can navigate to other public or protected pages.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md">
          Login
        </Link>
        <Link to="/register" className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors duration-300 shadow-md">
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default Welcome;
