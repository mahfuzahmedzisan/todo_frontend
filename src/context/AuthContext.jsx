import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

// 1. Create a new context for authentication
const AuthContext = createContext(null);

// 2. Custom hook to use the auth context easily
const useAuth = () => {
    return useContext(AuthContext);
};

// 3. The AuthProvider component to wrap your app
const AuthProvider = ({ children }) => {
    // Use localStorage to persist the token across page reloads for this demo
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // On initial load, check for an existing token in localStorage
    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    // A token exists, so we'll assume the user is authenticated for this demo.
                    // In a real application, you would make an API call here to validate the token.
                    setUser({ token });
                }
            } catch (error) {
                console.error("Failed to read from localStorage:", error);
            } finally {
                setLoading(false); // Authentication check is complete
            }
        };
        checkAuthStatus();
    }, []);

    // Login function updated to match your API response
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', credentials);            
            // Extract the token from the nested data object
            const token = response.data?.data?.token;

            if (token) {
                // Store the token in localStorage for this demonstration.
                // NOTE: For a production application, using secure, HTTP-only cookies
                // is the recommended approach to prevent XSS attacks.
                localStorage.setItem('authToken', token);
                setUser({ token });
                return true;
            } else {
                throw new Error("Token not found in response.");
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            // Throw the error so the Login component can handle it
            throw new Error(error.response?.data?.message || "Login failed");
        }
    };

    // Logout function
    const logout = () => {
        // Clear the token from localStorage and reset user state
        localStorage.removeItem('authToken');
        setUser(null);
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

export { AuthProvider, useAuth, AuthContext };
