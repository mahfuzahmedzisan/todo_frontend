"use client"
import { useAuth } from "../../contexts/AuthContext.jsx"
import { useSessionManager } from "../../hooks/useAuthGuard.jsx"

const RouteGuard = ({ children }) => {
  const { isAuthenticated } = useAuth()

  // Initialize session management for authenticated users
  useSessionManager()

  return <div className="min-h-screen">{children}</div>
}

export default RouteGuard
