import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';

import WelcomePage from './pages/Welcome.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import UsersPage from './pages/Users.jsx';
import TodosPage from './pages/Todos.jsx';

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-inter">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
            <Route path="/todos" element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
