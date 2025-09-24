"use client"

import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext.jsx"

const PublicRoute = ({ children, redirectIfAuthenticated = false, redirectTo = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is authenticated and should be redirected
  if (redirectIfAuthenticated && isAuthenticated) {
    // Get the intended destination from location state or use default
    const from = location.state?.from || redirectTo
    return <Navigate to={from} replace />
  }

  // Render children for public access
  return children
}

export default PublicRoute
