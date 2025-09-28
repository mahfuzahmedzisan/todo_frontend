import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { encryptedStorage, storageUtils } from '../utils/storage';
import authAPI from '../services/apiService'; // Renamed import for clarity

const AuthContext = createContext();

// Auth reducer for state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        // This payload receives the user-friendly message from ApiService.js
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: encryptedStorage.getUser() || null,
  token: encryptedStorage.getToken() || null,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to initialize the session from local storage
  const initializeSession = () => {
    const user = encryptedStorage.getUser();
    const token = encryptedStorage.getToken();

    if (user && token) {
      dispatch({
        type: 'RESTORE_SESSION',
        payload: { user, token },
      });
    }
  };

  useEffect(() => {
    initializeSession();
  }, []); // Run only once on mount

  const logout = async () => {
    // Clear storage first
    encryptedStorage.clear();
    sessionStorage.clear();

    // Update state
    dispatch({ type: 'LOGOUT' });
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });

    // The call will now fail fast (10s) and return a clear error object on network issues
    const result = await authAPI.login(credentials);

    if (result.success) {
      // Success path
      encryptedStorage.setToken(result.data.token);
      encryptedStorage.setUser(result.data.user);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data.user,
          token: result.data.token,
        },
      });
      return { success: true };
    } else {
      // Failure path (API error or Network error handled in ApiService.js)
      console.error("Login failed:", result.error);

      dispatch({
        type: 'LOGIN_FAILURE',
        // result.error contains the user-friendly network/API error message
        payload: result.error,
      });
      return { success: false, error: result.error };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' }); // Use LOGIN_START for register loading state

    const result = await authAPI.register(userData);

    if (result.success) {
      // Assuming successful registration should show a success message or redirect.
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true, data: result.data };
    } else {
      console.error("Registration failed:", result.error);

      dispatch({
        type: 'LOGIN_FAILURE',
        payload: result.error, // Display API or Network error
      });
      return { success: false, error: result.error };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Auto logout when token is not available
  const checkAuthStatus = () => {
    const token = encryptedStorage.getToken();
    if (!token && state.isAuthenticated) {
      logout();
    }
  };

  // Check auth status periodically
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,

    // Utility functions
    isAdmin: () => state.user?.is_admin || false,
    isVerified: () => state.user?.is_verified || false,
    getUserInitials: () => state.user?.initials || state.user?.name?.charAt(0) || "U",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};