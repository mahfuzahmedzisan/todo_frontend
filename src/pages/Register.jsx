import { useAuthGuard } from "../hooks/useAuthGuard.jsx"
import RegisterForm from "../components/auth/RegisterForm.jsx"
import PublicLayout from "../components/layout/PublicLayout.jsx"

const Register = () => {
    useAuthGuard({ requireAuth: false })

    return (
        <PublicLayout>
            <section className="flex-1 flex items-center justify-center p-4">
                <RegisterForm />
            </section>
        </PublicLayout>
    )
}

export default Register
