import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import theme from './theme'  

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Unauthorized from './pages/Unauthorized'
import JobList from './components/ojt/JobList'
import CreateOJTForm from './components/ojt/CreateOJTForm'
import OJTDetail from './components/ojt/OJTDetail'
import ApplyForm from './components/ojt/ApplyForm'
import ApplicationsList from './components/student/ApplicationList'

function App() {
  return (
    <ChakraProvider theme={theme}> 
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/ojt/:id" element={<OJTDetail />} />

            {/* Protected routes */}
            <Route 
                path="/dashboard" 
                element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
              } 
              
            />
            <Route 
                path="/ojt/:id/apply" 
                element={
                    <ProtectedRoute roles={['student']}>
                        <ApplyForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/student/applications"
                element={
                    <ProtectedRoute roles={['student']}>
                        <ApplicationsList />
                    </ProtectedRoute>
                }
            
            
            />



            {/* OJT Listings (Public) */}
            <Route path="/ojt" element={<JobList />} />


            {/* Company-only routes */}
            <Route 
              path="/ojt/create" 
              element={
                <ProtectedRoute roles={['company']}>
                    <CreateOJTForm />
                </ProtectedRoute>
              } 
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App