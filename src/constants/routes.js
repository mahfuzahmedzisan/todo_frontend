// Route constants for consistent navigation
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  VERIFY_EMAIL: "/verify-email",
  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "/404",
}

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.VERIFY_EMAIL,
  ROUTES.UNAUTHORIZED,
  ROUTES.NOT_FOUND,
]

// Routes that authenticated users should not access
export const AUTH_RESTRICTED_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER]

// Protected routes that require authentication
export const PROTECTED_ROUTES = [ROUTES.DASHBOARD]
