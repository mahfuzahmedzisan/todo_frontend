import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Base URL for your Laravel API.
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// 1. Create a new context for authentication.
const AuthContext = createContext(null);

// 2. Custom hook to use the auth context easily.
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Axios Interceptor for automated token handling.
// This interceptor will automatically add the Bearer token to every request header.
// This is the most efficient and secure way to handle JWT authentication.
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 4. The AuthProvider component to wrap your app.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On initial load, check for a valid token in localStorage.
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    // Make an API call to a protected route to validate the token.
                    await axios.get(`${API_BASE_URL}/me/todos`);
                    setUser({ token });
                }
            } catch (error) {
                // If the API call fails (e.g., 401 Unauthorized), the token is invalid.
                console.error("Token validation failed, logging out:", error.response?.data?.message || error.message);
                localStorage.removeItem('authToken');
                setUser(null);
            } finally {
                setLoading(false); // Authentication check is complete.
            }
        };
        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, credentials);
            const token = response.data?.data?.token;

            if (token) {
                // Store the token and user data.
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                setUser({ token, ...response.data.data.user });
                return true;
            } else {
                throw new Error("Token not found in response.");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    const logout = async () => {
        try {
            // Call the logout API endpoint.
            await axios.post(`${API_BASE_URL}/logout`);
        } catch (error) {
            console.error("Logout API failed:", error.response?.data?.message || error.message);
        } finally {
            // Clear the token and user data from localStorage and state.
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
