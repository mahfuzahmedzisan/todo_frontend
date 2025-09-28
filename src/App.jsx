import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from "./components/common/ErrorBoundary"
import NetworkStatus from "./components/common/NetworkStatus"
import RouteGuard from "./components/routing/RouteGuard"

// pages
import Home from './pages/frontend/Home'
import Login from './pages/auth/Login'
import Register from './pages/Register'
import DashboardPage from './pages/DashboardPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'
function App() { 
  // if (loading) {
  //   return <div>Loading...</div>
  // }
  return (
    <>
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <NetworkStatus />
            <RouteGuard >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
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
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </>
  )
}

export default App
