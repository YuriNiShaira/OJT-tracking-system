// src/pages/Login.jsx
import React, { useState } from 'react'
import { 
  Box, Container, Heading, FormControl, FormLabel, Input, 
  Button, VStack, Text, Alert, AlertIcon, Link, useToast 
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  
  const from = location.state?.from?.pathname || '/dashboard'
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const result = await login(username, password)
    
    if (result.success) {
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      })
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }
  
  return (
    <Container maxW="md" py={20}>
      <Box 
        p={8} 
        borderWidth={1} 
        borderRadius="xl" 
        boxShadow="lg"
        bg="green.400"
      >
        <VStack spacing={6} align="center">
          <Box textAlign="center">
            <Heading size="xl" color="yellow" mb={2}>OJTrack</Heading>
            <Heading size="md" color="gray.600">Internship Portal</Heading>
          </Box>
          
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="yellow"  // Changed from blue
                width="full"
                isLoading={loading}
                loadingText="Logging in..."
              >
                Login
              </Button>
            </VStack>
          </form>
          
          <Text>
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              Register here
            </Link>
          </Text>
          
          <Text fontSize="sm" color="gray.600">
            Demo: student/student123 | company/company123 | admin/admin123
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Login