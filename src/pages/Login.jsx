// import { useAuthGuard } from "../hooks/useAuthGuard.jsx"
import LoginForm from "../components/auth/LoginForm.jsx"
import PublicLayout from "../components/layout/PublicLayout.jsx"

const Login = () => {
    //   useAuthGuard({ requireAuth: false })

    return (
        <PublicLayout>
            <section className="flex-1 flex items-center justify-center p-4">
                <LoginForm />
            </section>
        </PublicLayout >
    )
}

export default Login