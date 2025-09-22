import React from 'react'
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-pink-50">
            <div className="bg-white p-10 rounded-lg shadow-xl text-center">
                <h1 className="text-4xl font-bold mb-4 text-rose-600">Welcome!</h1>
                <p className="text-lg text-gray-600 mb-6">You have successfully logged in.</p>
                <button
                    onClick={logout}
                    className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
