import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Spinner, Center } from '@chakra-ui/react'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="yellow.500" />
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute