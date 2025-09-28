import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

export default function Header({ isSidebarOpen, toggleSidebar }) {
    const { user, logout, isAuthenticated, getUserInitials, isLoading } = useAuth()
    return (
        <>
            <header>
                <div className="contianer flex items-center justify-between py-4 px-4 mx-auto">
                    <Link to='/' className='items-center justify-start inline-flex'>
                        {/* E text in svg */}
                        <svg className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white mr-2" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <text x="12" y="17" fontSize="15" textAnchor="middle">E</text>
                        </svg>
                        <span className="text-2xl font-bold text-gray-900">E-Commerce</span>
                    </Link>
                    <nav className='flex items-center justify-end space-x-4'>
                        <button onClick={toggleSidebar} className={`md:hidden p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                            </svg>
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link to={'/profile'} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                    Profile
                                </Link>
                                <Link to={'/dashboard'} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                    Dashboard
                                </Link>
                                <button onClick={logout} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to={'/login'} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                    Login
                                </Link>
                                <Link to={'/register'} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
        </>
    )
}
