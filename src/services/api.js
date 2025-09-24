import axios from "axios"
import { API_CONFIG, API_ENDPOINTS, SECURITY_HEADERS } from "../config/api.js"
import { secureStorage } from "../utils/storage.js"
import { generateCSRFToken } from "../utils/helpers.js"

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: SECURITY_HEADERS,
  withCredentials: true, // Important for CSRF protection
})

// CSRF Token management
let csrfToken = generateCSRFToken()

// Request interceptor for authentication and security
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token to headers
    config.headers["X-CSRF-TOKEN"] = csrfToken

    // Add auth token if available
    const token = secureStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp to prevent caching sensitive requests
    if (["post", "put", "patch", "delete"].includes(config.method)) {
      config.headers["X-Timestamp"] = Date.now()
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Update CSRF token if provided in response
    const newCsrfToken = response.headers["x-csrf-token"]
    if (newCsrfToken) {
      csrfToken = newCsrfToken
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear stored auth data
      secureStorage.removeItem("auth_token")
      secureStorage.removeItem("user_data")

      // Redirect to login
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // Handle 403 Forbidden (CSRF token mismatch)
    if (error.response?.status === 403) {
      csrfToken = generateCSRFToken()
    }

    // Handle network errors with retry logic
    if (!error.response && originalRequest._retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1

      await new Promise((resolve) => setTimeout(resolve, API_CONFIG.RETRY_DELAY * originalRequest._retryCount))

      return apiClient(originalRequest)
    }

    return Promise.reject(error)
  },
)

// Authentication API methods
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)

      if (response.data.success && response.data.data.token) {
        // Store token and user data securely
        secureStorage.setItem("auth_token", response.data.data.token)
        secureStorage.setItem("user_data", response.data.data.user)
        secureStorage.setItem("token_type", response.data.data.token_type)
      }

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)

      if (response.data.success && response.data.data.token) {
        // Store token and user data securely
        secureStorage.setItem("auth_token", response.data.data.token)
        secureStorage.setItem("user_data", response.data.data.user)
        secureStorage.setItem("token_type", response.data.data.token_type)
      }

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      // Always clear local storage regardless of API response
      secureStorage.clear()
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch profile")
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)

      if (response.data.success && response.data.data.token) {
        secureStorage.setItem("auth_token", response.data.data.token)
        return response.data.data.token
      }

      throw new Error("Token refresh failed")
    } catch (error) {
      secureStorage.clear()
      throw error
    }
  },
}

// Generic API methods
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data, config = {}) => apiClient.post(url, data, config),
  put: (url, data, config = {}) => apiClient.put(url, data, config),
  patch: (url, data, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
}

export default apiClient
