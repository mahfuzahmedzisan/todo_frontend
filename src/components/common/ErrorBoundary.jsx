"use client"

import React from "react"
import Button from "../ui/Button.jsx"

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

      // Default error UI
      return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-background border border-border rounded-lg shadow-lg p-8 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>

              <p className="text-muted-foreground mb-6">
                We're sorry, but something unexpected happened. Please try again or contact support if the problem
                persists.
              </p>

              {this.state.errorId && (
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Error ID: <span className="font-mono text-foreground">{this.state.errorId}</span>
                  </p>
                </div>
              )}

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left mb-6 p-4 bg-destructive/10 rounded-lg">
                  <summary className="cursor-pointer text-sm font-medium text-destructive mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-destructive overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                <Button className="w-full" onClick={this.handleRetry}>
                  Try Again
                </Button>

                <Button variant="outline" className="w-full bg-transparent" onClick={this.handleReload}>
                  Reload Page
                </Button>

                <Button variant="ghost" className="w-full" onClick={() => (window.location.href = "/")}>
                  Go to Home
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
