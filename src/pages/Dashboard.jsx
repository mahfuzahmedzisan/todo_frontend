import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// Base URL for your Laravel API.
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// The protected dashboard page component that fetches and displays user-specific data.
const Dashboard = () => {
    const { user, logout } = useAuth();
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${API_BASE_URL}/me/todos`);
                setTodos(response.data.data);
            } catch (error) {
                console.error("Failed to fetch todos:", error.response?.data?.message || error.message);
                setTodos([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchTodos();
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-pink-50 p-4">
            <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl text-center">
                <h1 className="text-4xl font-bold mb-4 text-rose-600">Dashboard</h1>
                <p className="text-lg text-gray-600 mb-6">Welcome, {user?.name || 'User'}!</p>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Todos</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                            {todos.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2 text-left">
                                    {todos.map(todo => (
                                        <li key={todo.id} className="text-gray-700">
                                            <span className="font-medium">{todo.title}</span>: {todo.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No todos found.</p>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={logout}
                    className="mt-8 bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
