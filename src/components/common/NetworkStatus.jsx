"use client"
import { useNetworkErrorHandler } from "../../hooks/useErrorHandler.jsx"
import Alert from "../ui/Alert.jsx"

const NetworkStatus = () => {
  const { isOnline, networkError, clearNetworkError } = useNetworkErrorHandler()

  if (isOnline && !networkError) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
          <div className="flex items-center justify-center">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
              />
            </svg>
            <span className="text-sm font-medium">You are currently offline</span>
          </div>
        </Alert>
      )}

      {networkError && (
        <Alert variant="destructive" className="rounded-none border-x-0 border-t-0" onClose={clearNetworkError}>
          <div className="flex items-center justify-center">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium">{networkError}</span>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default NetworkStatus
