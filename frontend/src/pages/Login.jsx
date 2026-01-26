import React, { useState } from 'react'
import {
  Flex, Box, VStack, FormControl, FormLabel,
  Input, Button, Alert, AlertIcon, Link,
  useToast, InputGroup, InputRightElement,
  IconButton, Text, Heading, HStack
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiEye, FiEyeOff, FiLock, FiUser, FiSearch, FiBriefcase, FiClock } from 'react-icons/fi'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <Flex minH="100vh" bgGradient="linear(135deg, #f0f9ff 0%, #f0fdf4 100%)" align="center" justify="center" p={4}>
      <HStack 
        spacing={0} 
        bg="green.200" 
        borderRadius="2xl" 
        boxShadow="2xl"
        overflow="hidden"
        maxW="900px"
        w="full"
      >
        {/* Left side - Info Panel */}
        <Box 
          flex={1}
          display={{ base: 'none', md: 'block' }}
          bgGradient="linear(135deg, #fde047 0%, #86efac 100%)"
          p={10}
          color="gray.800"
          position="relative"
          overflow="hidden"
          minH="500px"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-50px"
            left="-50px"
            w="150px"
            h="150px"
            borderRadius="full"
            bg="rgba(255,255,255,0.3)"
          />
          <Box
            position="absolute"
            bottom="-80px"
            right="-80px"
            w="200px"
            h="200px"
            borderRadius="full"
            bg="rgba(255,255,255,0.2)"
          />
          
          <Box position="relative" zIndex={1} h="full">
            <VStack spacing={6} align="flex-start" h="full" justify="center">
              {/* Brand */}
              <Box>
                <HStack spacing={3} mb={4}>
                  <Box p={3} bg="white" borderRadius="lg" color="yellow.600">
                    <FiBriefcase size={24} />
                  </Box>
                  <Heading size="xl" fontWeight="bold" color="gray.800">
                    OJT Finder
                  </Heading>
                </HStack>
                <Text fontSize="lg" color="gray.700" fontWeight="medium">
                  Discover amazing OJT opportunities
                </Text>
              </Box>

              {/* Features/Benefits */}
              <VStack spacing={6} align="flex-start" w="full" mt={8}>
                <HStack spacing={4}>
                  <Box p={3} bg="white" borderRadius="lg" color="green.600" boxShadow="sm">
                    <FiSearch size={20} />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                      Browse Listings
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Find OJT positions from local companies
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4}>
                  <Box p={3} bg="white" borderRadius="lg" color="green.600" boxShadow="sm">
                    <FiBriefcase size={20} />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                      Quick Apply
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Apply to positions with one click
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4}>
                  <Box p={3} bg="white" borderRadius="lg" color="green.600" boxShadow="sm">
                    <FiClock size={20} />
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" fontSize="lg" color="gray.800">
                      Save Time
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Fast and easy application process
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box 
          flex={1} 
          maxW="420px"
          bgGradient="linear(135deg, #fefce8 0%, #f7fee7 100%)"
          minH="500px"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative corner */}
          <Box
            position="absolute"
            top="0"
            right="0"
            w="200px"
            h="200px"
            bg="rgba(134, 239, 172, 0.1)"
            borderBottomLeftRadius="full"
          />
          
          <Box p={8} h="full">
            <VStack spacing={6} align="stretch" h="full" justify="center">
              {/* Mobile header */}
              <Box display={{ base: 'block', md: 'none' }} textAlign="center" mb={4}>
                <HStack spacing={3} justify="center" mb={2}>
                  <Box p={2} bg="green.400" borderRadius="md" color="white">
                    <FiBriefcase size={20} />
                  </Box>
                  <Heading size="lg" color="gray.800">
                    OJT Finder
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">Student Portal</Text>
              </Box>

              {/* Desktop header */}
              <Box display={{ base: 'none', md: 'block' }} textAlign="center" mb={4}>
                <Heading size="xl" color="gray.800" mb={2}>
                  Welcome Back
                </Heading>
                <Text color="gray.600">
                  Sign in to your account
                </Text>
              </Box>

              {error && (
                <Alert 
                  status="error" 
                  borderRadius="md" 
                  bg="red.50"
                  border="1px"
                  borderColor="red.200"
                >
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium" mb={1}>
                      Username
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        bg="white"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'green.300' }}
                        _focus={{ 
                          borderColor: 'green.400',
                          boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                          bg: 'white'
                        }}
                        h="48px"
                        pl={12}
                      />
                      <Box 
                        position="absolute" 
                        left="3" 
                        top="50%" 
                        transform="translateY(-50%)"
                      >
                        <FiUser color="green.500" />
                      </Box>
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.700" fontWeight="medium" mb={1}>
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        bg="white"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'green.300' }}
                        _focus={{ 
                          borderColor: 'green.400',
                          boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                          bg: 'white'
                        }}
                        h="48px"
                        pl={12}
                      />
                      <Box 
                        position="absolute" 
                        left="3" 
                        top="50%" 
                        transform="translateY(-50%)"
                      >
                        <FiLock color="green.500" />
                      </Box>
                      <InputRightElement h="48px" pr={2}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <FiEyeOff /> : <FiEye />}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          color="gray.500"
                          _hover={{ bg: 'transparent', color: 'green.500' }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Box textAlign="right" w="full">
                    <Link
                      as={RouterLink}
                      to="/forgot-password"
                      color="green.600"
                      fontWeight="medium"
                      fontSize="sm"
                      _hover={{ color: 'green.700', textDecoration: 'underline' }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    bgGradient="linear(to-r, yellow.400, yellow.500)"
                    color="white"
                    size="lg"
                    width="full"
                    isLoading={loading}
                    loadingText="Logging in..."
                    fontWeight="bold"
                    h="50px"
                    _hover={{
                      bgGradient: 'linear(to-r, yellow.500, yellow.600)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    _active={{
                      transform: 'translateY(0)'
                    }}
                  >
                    Login
                  </Button>

                  <Box textAlign="center" pt={2}>
                    <Text color="gray.600" fontSize="sm">
                      Don't have an account?{' '}
                      <Link
                        as={RouterLink}
                        to="/register"
                        color="green.600"
                        fontWeight="bold"
                        _hover={{ 
                          color: 'green.700', 
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px'
                        }}
                      >
                        Register here
                      </Link>
                    </Text>
                  </Box>
                </VStack>
              </form>
            </VStack>
          </Box>
        </Box>
      </HStack>
    </Flex>
  )
}

export default Login