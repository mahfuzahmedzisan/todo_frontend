import React, { useEffect, useState } from 'react'
import FrontendLayout from '../../components/layout/frontend/FrontendLayout'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useFormSecurity } from '../../hooks/useAuthGuard'
import { useAuth } from '../../contexts/AuthContext'
import { validators } from '../../utils/validation'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Alert from '../../components/ui/Alert'

export default function Login() {
    const { login, isLoading, error, clearError } = useAuth()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [formToken, setFormToken] = useState("")

    const { generateFormToken } = useFormSecurity()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setFormToken(generateFormToken())
    }, [generateFormToken])

    useEffect(() => {
        if (error) {
            clearError()
        }
        setErrors({})
    }, [formData])

    const validateForm = () => {
        const newErrors = {}
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }
        if (!formData.password) {
            newErrors.password = "Password is required"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: validators.sanitizeInput(value),
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return
        }
        try {
            const result = await login(formData)
            if (result.success) {
                const from = location.state?.from || "/dashboard"
                navigate(from, { replace: true })
            }
        } catch (error) {

            console.error("Login error:", error)
        }
    }

    return (
        <FrontendLayout>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                        <p className="text-muted-foreground mt-2">Sign in to your account</p>
                    </div>

                    {error && (
                        <Alert
                            variant="destructive"
                            title="Login Failed: Service Unavailable" // Professional, clear title
                            description={error} // The error message propagated from ApiService.js
                            onClose={clearError}
                            className="mb-4"
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="form_token" value={formToken} />

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                error={!!errors.email}
                                disabled={isLoading}
                                autoComplete="email"
                                required
                            />
                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    error={!!errors.password}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading} loading={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                </div>
            </div>

        </FrontendLayout>
    )
}
