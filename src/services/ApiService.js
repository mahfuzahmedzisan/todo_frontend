import axios from 'axios';
import { encryptedStorage } from '../utils/storage';
import { API_CONFIG } from '../config/api'; // <-- IMPORTANT: Import API_CONFIG here

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URL; 
    this.axiosInstance = this.createAxiosInstance();
  }

  createAxiosInstance() {
    const instance = axios.create({
      baseURL: this.baseURL,
      // 🚩 PROFESSIONAL FIX: Use the short, explicit timeout 🚩
      timeout: API_CONFIG.TIMEOUT, 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: false, 
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
      (config) => {
        const token = encryptedStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Global error handling, e.g., redirect on 401 token expired
        return Promise.reject(error);
      }
    );

    return instance;
  }

  // Generic API call handler
  async apiCall({ method, endpoint, data = null, params = null }) {
    try {
      const response = await this.axiosInstance.request({
        method,
        url: endpoint,
        data,
        params,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      // 1. API Error (Server responded with 4xx or 5xx)
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || `Error ${error.response.status}: Server responded with an error.`,
          status: error.response.status,
        };
      } 
      
      // 2. Network/Timeout Error (Axios failed to connect/response)
      const isNetworkError = 
          error.message.includes('Network Error') || 
          error.message.includes('timeout') || 
          error.code === 'ECONNABORTED' || 
          error.code === 'ERR_NETWORK'; // Catch browser-level refusal or Axios timeout

      if (isNetworkError) {
        // Log to console for developer debugging
        console.error("API Connection Failed (Timeout/Refused):", endpoint, error.message); 
        return {
            success: false,
            // Clear, user-friendly message after fast 10s timeout
            error: `Connection failed. The API server at ${this.baseURL} is offline or unreachable (Timeout: ${API_CONFIG.TIMEOUT / 1000}s).`,
            status: 503, // HTTP 503: Service Unavailable is the correct status for server being unavailable
        };
      } 
      
      // 3. Unexpected Error
      else {
        console.error("Unexpected API Error:", error);
        return {
          success: false,
          error: error.message || 'An unexpected client error occurred.',
          status: 500,
        };
      }
    }
  }

  // Auth methods
  async login(credentials) {
    return this.apiCall({
      method: 'POST',
      endpoint: '/login',
      data: credentials,
    });
  }

  async register(userData) {
    return this.apiCall({
      method: 'POST',
      endpoint: '/register',
      data: userData,
    });
  }

  async logout() {
    return this.apiCall({
      method: 'POST',
      endpoint: '/logout',
    });
  }
}

const authAPI = new ApiService();
export default authAPI;