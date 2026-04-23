import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Courses from './pages/Courses';
import Payments from './pages/Payments';
import Coupons from './pages/Coupons';

function App() {
  return (
    <AuthProvider>
        <Router>
             <Toaster position="top-right" />
             <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
                      {/* Redirect root to dashboard */}
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>} />
                      <Route path="courses" element={<Courses />} />
                      <Route path="payments" element={<Payments />} />
                      <Route path="coupons" element={<Coupons />} />
                  </Route>
             </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
