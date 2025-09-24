"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import Button from "../components/ui/Button.jsx"

const UnauthorizedPage = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-background border border-border rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>

          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </p>

          {user && (
            <div className="bg-muted rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Signed in as: <span className="font-medium text-foreground">{user.email}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Role: <span className="font-medium text-foreground">{user.is_admin ? "Administrator" : "User"}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>

            <Link to="/">
              <Button variant="outline" className="w-full bg-transparent">
                Go to Home
              </Button>
            </Link>

            <Button variant="ghost" className="w-full" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
