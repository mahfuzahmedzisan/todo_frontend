// API Configuration
export const API_CONFIG = {
  // Use VITE_API_BASE_URL from .env file
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1", 
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  RETRY_ATTEMPTS: import.meta.env.VITE_API_RETRY_ATTEMPTS || 3,
  RETRY_DELAY: import.meta.env.VITE_API_RETRY_DELAY || 1000,
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
    REFRESH: "/refresh",
    PROFILE: "/profile",
  },
  PRODUCTS: {
    LIST: "/products",
    DETAIL: "/products",
    SEARCH: "/products/search",
    CATEGORIES: "/categories",
  },
  ORDERS: {
    LIST: "/orders",
    CREATE: "/orders",
    DETAIL: "/orders",
  },
  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    UPDATE: "/cart/update",
    REMOVE: "/cart/remove",
    CLEAR: "/cart/clear",
  },
}

// Security Headers
export const SECURITY_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "X-CSRF-TOKEN": "", // Will be set dynamically
}