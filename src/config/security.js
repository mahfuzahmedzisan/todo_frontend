// Security configuration
export const SECURITY_CONFIG = {
  // Token expiry buffer (5 minutes before actual expiry)
  TOKEN_REFRESH_BUFFER: 5 * 60 * 1000,

  // Maximum login attempts before lockout
  MAX_LOGIN_ATTEMPTS: 5,

  // Lockout duration in milliseconds (15 minutes)
  LOCKOUT_DURATION: 15 * 60 * 1000,

  // Session timeout (24 hours)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,

  // CSRF token header name
  CSRF_HEADER: "X-CSRF-TOKEN",

  // Content Security Policy
  CSP_DIRECTIVES: {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-inline'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'", process.env.VITE_API_BASE_URL],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "media-src": ["'self'"],
    "frame-src": ["'none'"],
  },
}

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // API requests per minute
  API_REQUESTS_PER_MINUTE: 60,

  // Login attempts per minute
  LOGIN_ATTEMPTS_PER_MINUTE: 5,

  // Registration attempts per minute
  REGISTER_ATTEMPTS_PER_MINUTE: 3,
}
