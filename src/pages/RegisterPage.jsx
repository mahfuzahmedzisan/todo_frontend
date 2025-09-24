import { useAuthGuard } from "../hooks/useAuthGuard.jsx"
import RegisterForm from "../components/auth/RegisterForm.jsx"

const RegisterPage = () => {
  useAuthGuard({ requireAuth: false })

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
