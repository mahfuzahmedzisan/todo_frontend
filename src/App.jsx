import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import Login from './auth/Login'
import Home from './pages/Home'
import ProtectedRoute from './utils/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Header from './layouts/Header'


function App() {

  return (

    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          {/* Protected route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>

    // <>
    //   <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
    //     <h1 className='text-4xl font-bold mb-4'>Welcome to My App</h1>
    //     <p className='text-lg'>Get started here</p>
    //   </div>
    // </>
  )
}

export default App
