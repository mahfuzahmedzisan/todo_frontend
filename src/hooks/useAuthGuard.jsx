"use client"

import { useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"

// Custom hook for route protection
export const useAuthGuard = (options = {}) => {
  const {
    requireAuth = false,
    requireAdmin = false,
    requireVerified = false,
    redirectTo = "/login",
    redirectAuthenticatedTo = "/dashboard",
  } = options

  const { isAuthenticated, isLoading, user, isAdmin, isVerified } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, {
        state: { from: location.pathname },
        replace: true,
      })
      return
    }

    // If user is authenticated but trying to access auth pages
    if (isAuthenticated && ["/login", "/register"].includes(location.pathname)) {
      const from = location.state?.from || redirectAuthenticatedTo
      navigate(from, { replace: true })
      return
    }

    // If admin access is required
    if (requireAdmin && isAuthenticated && !isAdmin()) {
      navigate("/unauthorized", { replace: true })
      return
    }

    // If email verification is required
    if (requireVerified && isAuthenticated && !isVerified()) {
      navigate("/verify-email", { replace: true })
      return
    }
  }, [
    isAuthenticated,
    isLoading,
    user,
    location.pathname,
    navigate,
    requireAuth,
    requireAdmin,
    requireVerified,
    redirectTo,
    redirectAuthenticatedTo,
    isAdmin,
    isVerified,
  ])

  return {
    isAuthenticated,
    isLoading,
    user,
    canAccess: isAuthenticated && (!requireAdmin || isAdmin()) && (!requireVerified || isVerified()),
  }
}

// Hook for form security
// export const useFormSecurity = () => {
//   const generateFormToken = () => {
//     return crypto.getRandomValues(new Uint32Array(4)).join("-")
//   }

//   const validateFormToken = (token, storedToken) => {
//     return token && storedToken && token === storedToken
//   }

//   return {
//     generateFormToken,
//     validateFormToken,
//   }
// }

export const useFormSecurity = () => {
  // Memoize the function to ensure its reference is stable across renders.
  const generateFormToken = useCallback(() => {
    return crypto.getRandomValues(new Uint32Array(4)).join("-")
  }, []) // Empty dependency array means this function never changes.

  const validateFormToken = (token, storedToken) => {
    return token && storedToken && token === storedToken
  }

  return {
    generateFormToken,
    validateFormToken,
  }
}

// Hook for session management
export const useSessionManager = () => {
  const { logout, refreshAuthToken } = useAuth()

  useEffect(() => {
    let activityTimer
    let warningTimer

    const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
    const WARNING_TIMEOUT = 25 * 60 * 1000 // 25 minutes

    const resetTimers = () => {
      clearTimeout(activityTimer)
      clearTimeout(warningTimer)

      // Show warning before auto-logout
      warningTimer = setTimeout(() => {
        const shouldContinue = window.confirm(
          "Your session will expire in 5 minutes due to inactivity. Click OK to continue your session.",
        )

        if (shouldContinue) {
          refreshAuthToken()
          resetTimers()
        }
      }, WARNING_TIMEOUT)

      // Auto-logout after inactivity
      activityTimer = setTimeout(() => {
        alert("Your session has expired due to inactivity. Please log in again.")
        logout()
      }, INACTIVITY_TIMEOUT)
    }

    const handleActivity = () => {
      resetTimers()
    }

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initialize timers
    resetTimers()

    return () => {
      clearTimeout(activityTimer)
      clearTimeout(warningTimer)
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [logout, refreshAuthToken])
}
