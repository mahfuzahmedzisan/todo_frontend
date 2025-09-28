import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import { useAuth } from '../../../contexts/AuthContext'

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
    const { user, logout, isAuthenticated, getUserInitials, isLoading } = useAuth()
    return (
        <>
            <aside className={`fixed top-0 right-0 z-50 p-2 h-screen transition-transform  overflow-y-auto ${isSidebarOpen ? 'translate-x-0 w-screen' : 'translate-x-full w-0'}`} onClick={toggleSidebar}>
                <div className='p-4 w-full max-w-64 bg-rose-50 rounded-lg shadow h-full ml-auto'>
                    <div className='flex items-center justify-between mb-4'>
                        <Link to='/' className='items-center justify-start inline-flex'>
                            <svg className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white mr-2" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <text x="12" y="17" fontSize="15" textAnchor="middle">E</text>
                            </svg>
                        </Link>
                        <Button onClick={toggleSidebar}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                    <div>
                        <nav>
                            <Link to={'/'} className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 rounded-lg'>
                                Home
                            </Link>
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
                </div>
            </aside>
        </>
    )
}
