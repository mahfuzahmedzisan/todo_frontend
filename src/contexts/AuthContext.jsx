"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authAPI } from "../services/api.js"
import { secureStorage } from "../utils/storage.js"

// Auth context
const AuthContext = createContext(null)

// Auth states
const AUTH_STATES = {
  LOADING: "loading",
  AUTHENTICATED: "authenticated",
  UNAUTHENTICATED: "unauthenticated",
  ERROR: "error",
}

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_UNAUTHENTICATED: "SET_UNAUTHENTICATED",
  SET_ERROR: "SET_ERROR",
  UPDATE_USER: "UPDATE_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
}

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  status: AUTH_STATES.LOADING,
}

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null,
        status: AUTH_STATES.LOADING,
      }

    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        status: AUTH_STATES.AUTHENTICATED,
      }

    case AUTH_ACTIONS.SET_UNAUTHENTICATED:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        status: AUTH_STATES.UNAUTHENTICATED,
      }

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        status: AUTH_STATES.ERROR,
      }

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth()
  }, [])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (state.isAuthenticated && state.token) {
      const refreshInterval = setInterval(
        () => {
          refreshAuthToken()
        },
        15 * 60 * 1000,
      ) // Refresh every 15 minutes

      return () => clearInterval(refreshInterval)
    }
  }, [state.isAuthenticated, state.token])

  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING })

      // Clean up any corrupted storage first
      secureStorage.cleanupCorruptedData()

      const token = secureStorage.getItem('auth_token')
      const userData = secureStorage.getItem('user_data')

      if (token && userData) {
        // Verify token is still valid by fetching user profile
        try {
          const profileResponse = await authAPI.getProfile()
          if (profileResponse.success) {
            dispatch({
              type: AUTH_ACTIONS.SET_AUTHENTICATED,
              payload: {
                user: profileResponse.data.user || userData,
                token: token,
              },
            })
            return
          }
        } catch (error) {
          console.error("Token validation failed:", error)
          // Token is invalid, clear storage
          secureStorage.clear()
        }
      }

      dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED })
    } catch (error) {
      console.error("Auth initialization failed:", error)
      // Clear potentially corrupted storage
      secureStorage.clear()
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: "Failed to initialize authentication",
      })
    }
  }

  const login = async (credentials) => {
    try {
      // console.log("Login credentials:", credentials)
      dispatch({ type: AUTH_ACTIONS.SET_LOADING })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authAPI.login(credentials)
      // console.log("Login response:", response)


      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_AUTHENTICATED,
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed"
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      })
      dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      const response = await authAPI.register(userData)

      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_AUTHENTICATED,
          payload: {
            user: response.data.user,
            token: response.data.token,
          },
        })
        return { success: true, data: response.data }
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed"
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: errorMessage,
      })
      dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED })
      return { success: false, error: errorMessage }
    }
  }

  // const logout = async () => {
  //   try {
  //     dispatch({ type: AUTH_ACTIONS.SET_LOADING })

  //     // Call logout API
  //     await authAPI.logout()
  //   } catch (error) {
  //     console.error("Logout failed:", error)
  //   } finally {
  //     // Always clear state regardless of API response
  //     dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED })
  //   }
  // }

  const logout = async () => {
    try {
      console.log("Logging out...")
      dispatch({ type: AUTH_ACTIONS.SET_LOADING })
      // Call logout API (this will always succeed now)
      await authAPI.logout()
      return { success: true }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      // Always clear state regardless of API response
      dispatch({ type: AUTH_ACTIONS.SET_UNAUTHENTICATED })
    }
  }

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

  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    })

    // Update stored user data
    const currentUser = secureStorage.getItem("user_data")
    if (currentUser) {
      secureStorage.setItem("user_data", { ...currentUser, ...userData })
    }
  }

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

  // Context value
  const contextValue = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    status: state.status,

    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshAuthToken,

    // Utility functions
    isAdmin: () => state.user?.is_admin || false,
    isVerified: () => state.user?.is_verified || false,
    getUserInitials: () => state.user?.initials || state.user?.name?.charAt(0) || "U",
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

// HOC for components that require authentication
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Please log in to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

export default AuthContext
