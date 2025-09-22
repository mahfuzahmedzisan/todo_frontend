import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-rose-50/50 text-gray-800 p-4 fixed w-full backdrop-blur-md z-50">
            <div className='container mx-auto flex justify-between items-center'>
                <Link to="/" className="text-2xl font-bold">
                    My App
                </Link>
                <nav>
                    <ul className="flex items-center justify-end space-x-4">
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="text-gray-800 hover:text-gray-600 bg-rose-100 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-rose-200 transition-colors duration-200">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={logout}
                                        className="text-gray-800 hover:text-gray-600 font-semibold py-2 px-4 rounded bg-red-100 hover:bg-red-200 transition-colors duration-200"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li>
                                <Link to="/login" className="text-gray-800 hover:text-gray-600">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
