"use client"

import React from "react"
import Button from "../ui/Button.jsx" // Assuming Button component handles light/dark styles

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.setState({
      error,
      errorInfo,
      errorId,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error, errorInfo)
    }

    // In production, you would send this to your error reporting service
    this.logErrorToService(error, errorInfo, errorId)
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // In a real application, send error to logging service
    const errorData = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Example: Send to error reporting service
    // errorReportingService.log(errorData);

    console.error("Error logged:", errorData)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props

      // Use custom fallback if provided
      if (Fallback) {
        return <Fallback error={this.state.error} errorInfo={this.state.errorInfo} onRetry={this.handleRetry} />
      }

      // Default error UI - PROFESSIONALLY ENHANCED
      return (
        // Use a consistent, low-contrast background for the page
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-xl w-full mx-auto">
            {/* Main Error Card: Clean, high-contrast, rounded edges */}
            <div className="bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-gray-300/30 dark:shadow-black/50 p-6 sm:p-10 text-center">
              
              <div className="mb-8">
                {/* Visual Accent: Critical error color, clear alert icon */}
                <svg
                  className="mx-auto h-16 w-16 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight mb-3">
                Critical Application Failure
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Something went critically wrong. We are unable to render this section of the application.
              </p>

              {this.state.errorId && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 text-left border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-1">
                        Incident ID
                    </p>
                    <code className="text-sm font-mono text-gray-700 dark:text-gray-200 select-all break-all leading-relaxed">
                        {this.state.errorId}
                    </code>
                </div>
              )}

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg transition duration-150">
                  <summary className="cursor-pointer text-sm font-semibold text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    View Technical Stack Trace (Development Only)
                  </summary>
                  <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-700">
                      <pre className="text-xs text-red-800 dark:text-red-300 overflow-auto whitespace-pre-wrap max-h-64">
                        <strong className="block mb-1 text-red-900 dark:text-red-300">Error:</strong> {this.state.error.toString()}
                        <strong className="block mt-3 mb-1 text-red-900 dark:text-red-300">Component Stack:</strong> {this.state.errorInfo.componentStack}
                      </pre>
                  </div>
                </details>
              )}

              {/* Action Buttons: Clear hierarchy (Reload is usually the most effective fix) */}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                
                {/* Primary Action: Reload Page */}
                <Button className="w-full sm:w-auto px-6 py-3 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600" onClick={this.handleReload}>
                  Reload Application
                </Button>

                {/* Secondary Action: Go to Home */}
                <Button variant="outline" className="w-full sm:w-auto px-6 py-3 font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150" onClick={() => (window.location.href = "/")}>
                  Go to Home Page
                </Button>
                
                {/* Tertiary Action: Retry (less prominent) */}
                <Button variant="ghost" className="w-full sm:w-auto px-6 py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={this.handleRetry}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary