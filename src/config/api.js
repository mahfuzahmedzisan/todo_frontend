// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000/api/v1",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
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
