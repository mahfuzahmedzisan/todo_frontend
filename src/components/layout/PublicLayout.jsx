"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function PublicLayout({ children }) {
    const { user } = useAuth()

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-rose-50 to-pink-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-gray-900">
                                E-Commerce
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col">{children}</main>

            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p>&copy; 2025 E-Commerce. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
