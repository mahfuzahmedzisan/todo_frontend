import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './layouts/Header.jsx';
import Home from './pages/Home.jsx';
import Login from './auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';

// The main application component that sets up the routing and context providers.
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected route. Use the ProtectedRoute component to guard the dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} /> */}
          {/* </Route> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
