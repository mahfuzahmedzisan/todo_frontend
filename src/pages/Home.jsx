"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import PublicLayout from "../components/layout/PublicLayout"

export default function Home() {
    const { user } = useAuth()

    return (
        <PublicLayout>
            <div className="relative overflow-hidden">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our E-Commerce Store</h1>
                            <p className="text-xl md:text-2xl mb-8 text-blue-100">Discover amazing products at unbeatable prices</p>
                            {!user ? (
                                <div className="space-x-4">
                                    <Link
                                        to="/register"
                                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold inline-block"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                            <p className="text-lg text-gray-600">We provide the best shopping experience with top-quality products</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Shopping</h3>
                                <p className="text-gray-600">Your data and transactions are protected with enterprise-grade security</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                                <p className="text-gray-600">Quick and reliable shipping to get your products to you faster</p>
                            </div>

                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
                                <p className="text-gray-600">Carefully curated products that meet our high standards</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
                        <p className="text-lg text-gray-600 mb-8">Join thousands of satisfied customers today</p>
                        {!user && (
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold inline-block"
                            >
                                Create Account
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
