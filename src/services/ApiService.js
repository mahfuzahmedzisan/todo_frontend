import axios from 'axios';
import { encryptedStorage } from '../utils/storage';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
    this.axiosInstance = this.createAxiosInstance();
  }

  createAxiosInstance() {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Support for wildcard CORS (as requested)
      withCredentials: false, // Set to true when implementing specific origins
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
        if (error.response?.status === 401) {
          // Token expired or invalid
          encryptedStorage.clearAll();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  // Common API call method - reusable for all requests
  async apiCall(config) {
    try {
      const {
        method = 'GET',
        endpoint,
        data = null,
        params = null,
        headers = {},
        timeout = 30000
      } = config;

      const response = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        params,
        headers,
        timeout,
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      };
    }
  }

  // Authentication methods
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

  // Token verification method (commented out as requested)
  /*
  async verifyToken() {
    return this.apiCall({
      method: 'GET',
      endpoint: '/verify-token',
    });
  }
  */

  // Todo methods (for testing authenticated routes)
  async getTodos(params = null) {
    return this.apiCall({
      method: 'GET',
      endpoint: '/me/todos',
      params,
    });
  }

  async getTodo(id) {
    return this.apiCall({
      method: 'GET',
      endpoint: `/me/todos/${id}`,
    });
  }

  async createTodo(todoData) {
    return this.apiCall({
      method: 'POST',
      endpoint: '/me/todos',
      data: todoData,
    });
  }

  async updateTodo(id, todoData) {
    return this.apiCall({
      method: 'PUT',
      endpoint: `/me/todos/${id}`,
      data: todoData,
    });
  }

  async deleteTodo(id) {
    return this.apiCall({
      method: 'DELETE',
      endpoint: `/me/todos/${id}`,
    });
  }

  // Method to set custom headers for specific origins (for future use)
  /*
  setAllowedOrigins(origins) {
    this.axiosInstance.defaults.headers['Access-Control-Allow-Origin'] = origins.join(',');
    this.axiosInstance.defaults.withCredentials = true;
  }
  */
}

export default new ApiService();