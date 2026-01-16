import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Spinner, Center } from '@chakra-ui/react'
import DashboardLayout from '../components/Layout/DashboardLayout'

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
  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />
      case 'company':
        return <CompanyDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return (
          <Center h="100vh">
            <Spinner size="xl" />
          </Center>
        )
    }
  }

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>
}

export default Dashboard