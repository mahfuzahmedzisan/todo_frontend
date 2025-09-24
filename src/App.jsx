import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ErrorBoundary from "./components/common/ErrorBoundary"
import NetworkStatus from "./components/common/NetworkStatus"
import RouteGuard from "./components/routing/RouteGuard"
import ProtectedRoute from "./components/routing/ProtectedRoute"
import PublicRoute from "./components/routing/PublicRoute"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import NotFoundPage from "./pages/NotFoundPage"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <NetworkStatus />
          <RouteGuard>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />

              {/* Auth Routes - Redirect to dashboard if already authenticated */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Email Verification */}
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Error Pages */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />

              {/* Catch all - redirect to 404 */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </RouteGuard>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
