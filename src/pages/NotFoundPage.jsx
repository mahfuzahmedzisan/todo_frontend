"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import Button from "../components/ui/Button.jsx"

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-background border border-border rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
          </div>

          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate(-1)}>
              Go Back
            </Button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Go to Home
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
