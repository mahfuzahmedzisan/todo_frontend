// services/api.js - Fixed version
import axios from 'axios'
import { encryptedStorage } from '../utils/storage.js'
import { API_CONFIG, API_ENDPOINTS, SECURITY_HEADERS } from '../config/api.js'
import { securityMiddleware } from '../utils/security.js'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Set to true since you're using supports_credentials: true
  headers: {
    ...SECURITY_HEADERS,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = encryptedStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add security headers
    config = securityMiddleware.addSecurityHeaders(config)

    // Sanitize request data
    if (config.data) {
      config.data = securityMiddleware.sanitizeRequestData(config.data)
    }

    // console.log('API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data)
    
    const originalRequest = error.config

    // Handle 401 errors (unauthorized) - but NOT for logout/refresh requests
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/logout') &&
        !originalRequest.url.includes('/refresh')) {
      
      originalRequest._retry = true

      try {
        // Only try to refresh if we have a token
        if (encryptedStorage.hasToken()) {
          const refreshResponse = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)
          
          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.token
            encryptedStorage.setItem('auth_token', newToken)
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return apiClient(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear storage but don't redirect here - let the calling component handle it
        encryptedStorage.clear()
      }
    }

    return Promise.reject(error)
  }
)

// Auth API methods
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      
      if (response.data.success) {
        // console.log('Login response data:', response.data)
        
        // Check what token we're getting
        const token = response.data.token || response.data.data?.token
        const user = response.data.user || response.data.data?.user
        
        // console.log('Token to store:', token)
        // console.log('User to store:', user)
        
        // Store token and user data
        if (token) {
          encryptedStorage.setItem('auth_token', token)
          // console.log('Token stored successfully')
        }
        
        if (user) {
          encryptedStorage.setItem('user_data', user)
          // console.log('User data stored successfully')
        }
      }
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      return {
        success: false,
        message,
        error: message
      }
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
      
      if (response.data.success) {
        // Store token and user data
        encryptedStorage.setItem('auth_token', response.data.token)
        encryptedStorage.setItem('user_data', response.data.user)
      }
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      return {
        success: false,
        message,
        error: message
      }
    }
  },

  logout: async () => {
    try {
      // Only try to call logout API if we have a valid token
      if (encryptedStorage.hasToken()) {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      }
      return { success: true }
    } catch (error) {
      console.error('Logout API error:', error)
      // Don't throw error for logout - always succeed locally
      // return { success: true }
      throw new Error('Logout failed')
    } finally {
      // Always clear local storage regardless of API response
      encryptedStorage.clear()
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to get profile'
      return {
        success: false,
        message,
        error: message
      }
    }
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH)
      const newToken = response.data.token
      
      if (newToken) {
        encryptedStorage.setItem('auth_token', newToken)
        return newToken
      }
      
      throw new Error('No token in refresh response')
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }
}

export default apiClient