import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { encryptedStorage, storageUtils } from '../utils/storage';
import apiService from '../services/apiService';

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
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto-refresh token before expiration
  // useEffect(() => {
  //   if (state.isAuthenticated && state.token) {
  //     const refreshInterval = setInterval(
  //       () => {
  //         refreshAuthToken()
  //       },
  //       15 * 60 * 1000,
  //     ) // Refresh every 15 minutes

  //     return () => clearInterval(refreshInterval)
  //   }
  // }, [state.isAuthenticated, state.token])

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Initialize storage
      storageUtils.initStorage();

      // Check for existing session
      const token = encryptedStorage.getToken();
      const user = encryptedStorage.getUser();

      if (token && user) {
        // Optional: Verify token with server (commented as requested)
        /*
        const verifyResult = await apiService.verifyToken();
        if (verifyResult.success) {
          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user, token },
          });
        } else {
          // Token is invalid, clear storage
          encryptedStorage.clearAll();
          dispatch({ type: 'LOGOUT' });
        }
        */

        // For now, just restore from storage
        dispatch({
          type: 'RESTORE_SESSION',
          payload: { user, token },
        });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const result = await apiService.login(credentials);

      if (result.success && result.data.success) {
        const { user, token } = result.data.data;

        // Store encrypted data
        encryptedStorage.setToken(token, { expires: 7 });
        encryptedStorage.setUser(user, { expires: 7 });

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });

        return { success: true, data: { user, token } };
      } else {
        const errorMessage = result.data?.message || 'Login failed';
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const result = await apiService.register(userData);

      if (result.success && result.data.success) {
        const { user, token } = result.data.data;

        // Store encrypted data
        encryptedStorage.setToken(token, { expires: 7 });
        encryptedStorage.setUser(user, { expires: 7 });

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });

        return { success: true, data: { user, token } };
      } else {
        const errorMessage = result.data?.message || 'Registration failed';
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data
      storageUtils.clearAllStorage();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshAuthToken = async () => {
    try {
      const newToken = await authAPI.refreshToken()
      dispatch({
        type: AUTH_ACTIONS.SET_AUTHENTICATED,
        payload: {
          user: state.user,
          token: newToken,
        },
      })
    } catch (error) {
      console.error("Token refresh failed:", error)
      logout()
    }
  }

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};