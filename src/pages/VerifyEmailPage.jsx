"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import Button from "../components/ui/Button.jsx"
import Alert from "../components/ui/Alert.jsx"

const VerifyEmailPage = () => {
    const { user, logout } = useAuth()
    const [isResending, setIsResending] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleResendVerification = async () => {
        setIsResending(true)
        setMessage("")
        setError("")

        try {
            // In a real app, you would call an API to resend verification email
            // const response = await authAPI.resendVerification();

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setMessage("Verification email sent! Please check your inbox.")
        } catch (error) {
            setError("Failed to send verification email. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-muted flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-background border border-border rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto h-16 w-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h1>

                        <p className="text-muted-foreground">
                            We've sent a verification link to your email address. Please check your inbox and click the link to verify
                            your account.
                        </p>
                    </div>

                    {user && (
                        <div className="bg-muted rounded-lg p-4 mb-6">
                            <p className="text-sm text-muted-foreground text-center">
                                Email sent to: <span className="font-medium text-foreground">{user.email}</span>
                            </p>
                        </div>
                    )}

                    {message && (
                        <Alert variant="success" className="mb-4">
                            {message}
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    <div className="space-y-3">
                        <Button className="w-full" onClick={handleResendVerification} disabled={isResending} loading={isResending}>
                            {isResending ? "Sending..." : "Resend Verification Email"}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Already verified?</p>
                            <Link to="/dashboard">
                                <Button variant="outline" className="w-full bg-transparent">
                                    Continue to Dashboard
                                </Button>
                            </Link>
                        </div>

                        <div className="text-center pt-4 border-t border-border">
                            <Button variant="ghost" className="w-full" onClick={logout}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage
