import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// The public home page component.
const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-pink-50'>
            <div className='bg-white p-10 rounded-lg shadow-xl text-center'>
                <h1 className='text-4xl font-bold mb-4 text-rose-600'>Welcome!</h1>
                <p className='text-lg text-gray-600 mb-6'>to My App</p>
                {isAuthenticated ? (
                    <button
                        className='bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200'
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard
                    </button>
                ) : (
                    <button
                        className='bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200'
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home;
