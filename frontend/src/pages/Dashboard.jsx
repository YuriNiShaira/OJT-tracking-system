// src/pages/Dashboard.jsx
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Spinner, Center } from '@chakra-ui/react'

// Import role-specific dashboards
import StudentDashboard from '../components/dashboards/StudentDashboard'
import CompanyDashboard from '../components/dashboards/CompanyDashboard'
import AdminDashboard from '../components/dashboards/AdminDashboard'

const Dashboard = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="yellow.500" />
      </Center>
    )
  }

  // Render dashboard based on role
  switch (user?.role) {
    case 'student':
      return <StudentDashboard />
    case 'company':
      return <CompanyDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      // Fallback or redirect to login
      return (
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      )
  }
}

export default Dashboard