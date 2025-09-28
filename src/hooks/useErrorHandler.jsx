"use client"

import React from "react"

import { useState, useCallback } from "react"

export const useErrorHandler = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback((error, context = "") => {
    console.error(`Error in ${context}:`, error)

    // Extract meaningful error message
    let errorMessage = "An unexpected error occurred"

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    }

    setError({
      message: errorMessage,
      context,
      timestamp: new Date().toISOString(),
      originalError: error,
    })

    // Auto-clear error after 10 seconds
    setTimeout(() => {
      setError(null)
    }, 10000)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeWithErrorHandling = useCallback(
    async (asyncFunction, context = "") => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await asyncFunction()
        return { success: true, data: result }
      } catch (error) {
        handleError(error, context)
        return { success: false, error }
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeWithErrorHandling,
  }
}

// Hook for network error handling
export const useNetworkErrorHandler = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [networkError, setNetworkError] = useState(null)

  const handleNetworkError = useCallback((error) => { 
    if (!navigator.onLine) {
      setNetworkError("You are currently offline. Please check your internet connection.")
    } else if (error.code === "NETWORK_ERROR") {
      setNetworkError("Network error. Please check your connection and try again.")
    } else if (error.response?.status >= 500) {
      setNetworkError("Server error. Please try again later.")
    } else if (error.response?.status === 429) {
      setNetworkError("Too many requests. Please wait a moment and try again.")
    } else {
      setNetworkError("Connection error. Please try again.")
    }
  }, [])

  const clearNetworkError = useCallback(() => {
    setNetworkError(null)
  }, [])

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setNetworkError(null)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setNetworkError("You are currently offline. Please check your internet connection.")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return {
    isOnline,
    networkError,
    handleNetworkError,
    clearNetworkError,
  }
}
