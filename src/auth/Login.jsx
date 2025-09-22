// Login.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { isAuthenticated, loading } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        try {
            const success = await login({ phone, password });
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Login failed');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
                <p className="text-xl text-gray-700">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 transform scale-100 hover:scale-105">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Welcome</h2>
                <p className="text-center text-sm text-gray-500 mb-6">Login to your account</p>
                {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                            placeholder="e.g., +1234567890"
                            required
                        />

                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <span className="relative flex items-center">
                            {/* <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                placeholder="********"
                                required
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2"
                            >
                                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v1"></path>
                            </svg> */}
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                                placeholder="********"
                                required
                            />

                            {/* Locked or Unlocked Icon like the above unlocked icon svg*/}

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                onClick={() => setShowPassword(!showPassword)}
                                role="button"
                                tabIndex={0}
                                className={`absolute right-3 top-1/2 h-5 w-5 text-gray-400 transform -translate-y-1/2 cursor-pointer`}
                            >
                                {showPassword ? (
                                    // Unlock Path 
                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v1"></path>
                                ) : (
                                    // Locked Path
                                    <path d="M18 8h-1V6a5 5 0 00-10 0v2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-6 7a3 3 0 01-3-3"></path>
                                )}
                            </svg>
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 transition-all duration-200"
                    >
                        {isLoggingIn ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default Login;