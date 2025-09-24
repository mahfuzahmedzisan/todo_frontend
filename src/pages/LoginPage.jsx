import { useAuthGuard } from "../hooks/useAuthGuard.jsx"
import LoginForm from "../components/auth/LoginForm.jsx"

const LoginPage = () => {
  useAuthGuard({ requireAuth: false })

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage