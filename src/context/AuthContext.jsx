import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/api.js';

// Create a context for authentication
const AuthContext = createContext(null);

// Auth Provider component to manage and provide authentication state
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Axios interceptor to handle authentication and token management
  useEffect(() => {
    // Set default Authorization header if token exists
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (err) => {
        // Handle unauthorized errors (401)
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    // Cleanup the interceptor on component unmount
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [token]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      
      // Set the authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/register', { name, email, password });
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      
      // Set the authorization header for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoading(false);
      return { success: true, message: response.data.message };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  const value = { token, user, login, register, logout, loading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
