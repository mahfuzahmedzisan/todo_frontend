// Security utilities for XSS prevention, CSRF protection, and input sanitization
export class SecurityManager {
  constructor() {
    this.csrfToken = this.generateCSRFToken()
    this.rateLimitMap = new Map()
  }

  // Generate CSRF token
  generateCSRFToken() {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Validate CSRF token
  validateCSRFToken(token) {
    return token === this.csrfToken
  }

  // XSS Prevention - Sanitize HTML content
  sanitizeHTML(input) {
    if (typeof input !== "string") return input

    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    }

    return input.replace(/[&<>"'/]/g, (s) => map[s])
  }

  // SQL Injection Prevention - Sanitize input for API calls
  sanitizeInput(input) {
    if (typeof input !== "string") return input

    // Remove potentially dangerous SQL keywords and characters
    const dangerousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /['"`;\\]/g,
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ]

    let sanitized = input
    dangerousPatterns.forEach((pattern) => {
      sanitized = sanitized.replace(pattern, "")
    })

    return sanitized.trim()
  }

  // Rate limiting for API calls
  checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now()
    const windowStart = now - windowMs

    if (!this.rateLimitMap.has(identifier)) {
      this.rateLimitMap.set(identifier, [])
    }

    const requests = this.rateLimitMap.get(identifier)

    // Remove old requests outside the window
    const validRequests = requests.filter((timestamp) => timestamp > windowStart)

    if (validRequests.length >= maxRequests) {
      return false // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now)
    this.rateLimitMap.set(identifier, validRequests)

    return true // Request allowed
  }

  // Content Security Policy headers
  getCSPHeaders() {
    return {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' http://127.0.0.1:8000",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    }
  }

  // Validate file uploads
  validateFileUpload(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
    const errors = []

    if (!file) {
      errors.push("No file selected")
      return { isValid: false, errors }
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(", ")}`)
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".com", ".js", ".vbs"]
    const fileName = file.name.toLowerCase()
    const hasDangerousExtension = dangerousExtensions.some((ext) => fileName.endsWith(ext))

    if (hasDangerousExtension) {
      errors.push("File type not allowed for security reasons")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Password strength validation
  validatePasswordStrength(password) {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommonPatterns: !this.isCommonPassword(password),
    }

    const score = Object.values(requirements).filter(Boolean).length
    const strength = score < 3 ? "weak" : score < 5 ? "medium" : "strong"

    return {
      score,
      strength,
      requirements,
      isValid: score >= 4,
    }
  }

  // Check against common passwords
  isCommonPassword(password) {
    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
      "password123",
      "admin",
      "letmein",
      "welcome",
      "monkey",
    ]

    return commonPasswords.includes(password.toLowerCase())
  }

  // Generate secure random string
  generateSecureRandom(length = 32) {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Validate email format with additional security checks
  validateSecureEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Invalid email format" }
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /[<>]/, // HTML tags
      /javascript:/i, // JavaScript protocol
      /data:/i, // Data protocol
      /\s{2,}/, // Multiple spaces
    ]

    const hasSuspiciousPattern = suspiciousPatterns.some((pattern) => pattern.test(email))

    if (hasSuspiciousPattern) {
      return { isValid: false, error: "Email contains invalid characters" }
    }

    return { isValid: true }
  }
}

// Create singleton instance
export const securityManager = new SecurityManager()

// Security middleware for API calls
export const securityMiddleware = {
  // Add security headers to requests
  addSecurityHeaders: (config) => {
    const headers = {
      ...config.headers,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-CSRF-Token": securityManager.csrfToken,
      ...securityManager.getCSPHeaders(),
    }

    return { ...config, headers }
  },

  // Sanitize request data
  sanitizeRequestData: (data) => {
    if (typeof data !== "object" || data === null) {
      return data
    }

    const sanitized = {}
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitized[key] = securityManager.sanitizeInput(value)
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = securityMiddleware.sanitizeRequestData(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  },
}
