"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext.jsx"

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireVerified = false,
  fallback = null,
}) => {
  const { isAuthenticated, isLoading, user, isAdmin, isVerified } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    )
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Check admin requirement
  if (requireAdmin && isAuthenticated && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check email verification requirement
  if (requireVerified && isAuthenticated && !isVerified()) {
    return <Navigate to="/verify-email" replace />
  }

  // All checks passed, render children
  return children
}

export default ProtectedRoute
