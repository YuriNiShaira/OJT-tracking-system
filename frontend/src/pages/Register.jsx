import React, { useState } from 'react'
import {
  Flex, Box, VStack, FormControl, FormLabel, Input,
  Button, Text, Alert, AlertIcon, Radio, RadioGroup,
  Stack, Link, useToast, Select, Heading, HStack,
  InputGroup, InputRightElement, IconButton
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiBriefcase, FiShield } from 'react-icons/fi'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'student',
    first_name: '',
    last_name: '',
    phone: '',
    student_id: '',
    course: '',
    year_level: '',
    company_name: '',
    company_address: '',
    company_description: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    const cleanedData = { ...formData }
    
    if (cleanedData.role === 'company') {
      cleanedData.student_id = null
      cleanedData.course = null
      cleanedData.year_level = null
    } else if (cleanedData.role === 'student') {
      cleanedData.company_name = null
      cleanedData.company_address = null
      cleanedData.company_description = null
    } else if (cleanedData.role === 'admin') {
      // Admin users might have different fields or none of these
      cleanedData.student_id = null
      cleanedData.course = null
      cleanedData.year_level = null
      cleanedData.company_name = null
      cleanedData.company_address = null
      cleanedData.company_description = null
    }
    
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '') {
        cleanedData[key] = null
      }
    })
    
    const result = await register(cleanedData) 

    if (result.success) {
      toast({
        title: 'Registration successful!',
        description: 'Welcome to OJT Finder System',
        status: 'success',
        duration: 5000,
      })
      navigate('/dashboard')
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error)
      } else {
        toast({
          title: 'Registration failed',
          description: result.error,
          status: 'error',
          duration: 5000,
        })
      }
    }
    
    setLoading(false)
  }

  return (
    <Flex minH="100vh" bgGradient="linear(135deg, #f0f9ff 0%, #f0fdf4 100%)" align="center" justify="center" p={4}>
      <Box
        w="full"
        maxW="800px"
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <HStack spacing={0}>
          {/* Left side - Decorative */}
          <Box 
            flex={1}
            display={{ base: 'none', lg: 'block' }}
            bgGradient="linear(135deg, #fde047 0%, #86efac 100%)"
            p={10}
            color="gray.800"
            position="relative"
            overflow="hidden"
            minH="600px"
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
              <VStack spacing={6} align="center" h="full" justify="center">
                <HStack spacing={3} mb={4}>
                  <Box p={4} bg="white" borderRadius="xl" color="green.600" boxShadow="md">
                    <FiBriefcase size={32} />
                  </Box>
                </HStack>
                <Heading size="xl" fontWeight="bold" color="gray.800" textAlign="center">
                  Join OJT Finder
                </Heading>
                <Text fontSize="lg" color="gray.700" textAlign="center" maxW="300px">
                  Start your OJT journey with us today
                </Text>
              </VStack>
            </Box>
          </Box>

          {/* Right side - Register Form */}
          <Box 
            flex={1} 
            bgGradient="linear(135deg, #fefce8 0%, #f7fee7 100%)"
            minH="600px"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="0"
              right="0"
              w="200px"
              h="200px"
              bg="rgba(134, 239, 172, 0.1)"
              borderBottomLeftRadius="full"
            />
            
            <Box p={8} h="full" overflowY="auto" maxH="600px">
              <VStack spacing={6} align="stretch">
                {/* Mobile header */}
                <Box display={{ base: 'block', lg: 'none' }} textAlign="center" mb={4}>
                  <HStack spacing={3} justify="center" mb={2}>
                    <Box p={2} bg="green.400" borderRadius="md" color="white">
                      <FiBriefcase size={20} />
                    </Box>
                    <Heading size="lg" color="gray.800">
                      Create Account
                    </Heading>
                  </HStack>
                  <Text color="gray.600" fontSize="sm">Join OJT Finder</Text>
                </Box>

                {/* Desktop header */}
                <Box display={{ base: 'none', lg: 'block' }} textAlign="center" mb={4}>
                  <Heading size="xl" color="gray.800" mb={2}>
                    Create Account
                  </Heading>
                  <Text color="gray.600">
                    Fill in your details below
                  </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    {/* Account Type - Now including Admin */}
                    <FormControl isRequired isInvalid={errors.role}>
                      <FormLabel color="gray.700" fontWeight="medium" mb={2}>
                        Account Type
                      </FormLabel>
                      <RadioGroup 
                        value={formData.role} 
                        onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      >
                        <Stack direction="row" spacing={4} justify="center" wrap="wrap">
                          <Radio 
                            value="student" 
                            colorScheme="green"
                            borderColor="gray.300"
                            _checked={{ bg: 'green.500', borderColor: 'green.500' }}
                          >
                            Student
                          </Radio>
                          <Radio 
                            value="company" 
                            colorScheme="green"
                            borderColor="gray.300"
                            _checked={{ bg: 'green.500', borderColor: 'green.500' }}
                          >
                            Company
                          </Radio>
                          <Radio 
                            value="admin" 
                            colorScheme="green"
                            borderColor="gray.300"
                            _checked={{ bg: 'green.500', borderColor: 'green.500' }}
                          >
                            Admin
                          </Radio>
                        </Stack>
                      </RadioGroup>
                      {errors.role && <Text color="red.500" fontSize="sm" mt={1}>{errors.role[0]}</Text>}
                    </FormControl>

                    {/* Basic Information */}
                    <HStack spacing={4} w="full">
                      <FormControl isInvalid={errors.first_name}>
                        <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                          First Name
                        </FormLabel>
                        <Input
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="First name"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                        />
                        {errors.first_name && <Text color="red.500" fontSize="xs">{errors.first_name[0]}</Text>}
                      </FormControl>
                      
                      <FormControl isInvalid={errors.last_name}>
                        <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                          Last Name
                        </FormLabel>
                        <Input
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Last name"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                        />
                        {errors.last_name && <Text color="red.500" fontSize="xs">{errors.last_name[0]}</Text>}
                      </FormControl>
                    </HStack>

                    <FormControl isRequired isInvalid={errors.username}>
                      <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                        Username
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Choose username"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                          pl={10}
                        />
                        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                          <FiUser color="green.500" size={16} />
                        </Box>
                      </InputGroup>
                      {errors.username && <Text color="red.500" fontSize="xs">{errors.username[0]}</Text>}
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.email}>
                      <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                        Email
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                          pl={10}
                        />
                        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                          <FiMail color="green.500" size={16} />
                        </Box>
                      </InputGroup>
                      {errors.email && <Text color="red.500" fontSize="xs">{errors.email[0]}</Text>}
                    </FormControl>

                    <FormControl isInvalid={errors.phone}>
                      <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                        Phone Number
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                          pl={10}
                        />
                        <Box position="absolute" left="3" top="50%" transform="translateY(-50%)">
                          <FiPhone color="green.500" size={16} />
                        </Box>
                      </InputGroup>
                      {errors.phone && <Text color="red.500" fontSize="xs">{errors.phone[0]}</Text>}
                    </FormControl>

                    {/* Student Fields */}
                    {formData.role === 'student' && (
                      <>
                        <FormControl isInvalid={errors.student_id}>
                          <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                            Student ID
                          </FormLabel>
                          <Input
                            name="student_id"
                            value={formData.student_id}
                            onChange={handleChange}
                            placeholder="Enter student ID"
                            bg="white"
                            border="2px"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'green.300' }}
                            _focus={{ 
                              borderColor: 'green.400',
                              boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                              bg: 'white'
                            }}
                            h="40px"
                          />
                          {errors.student_id && <Text color="red.500" fontSize="xs">{errors.student_id[0]}</Text>}
                        </FormControl>
                        
                        <HStack spacing={4} w="full">
                          <FormControl isInvalid={errors.course}>
                            <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                              Course
                            </FormLabel>
                            <Select
                              name="course"
                              value={formData.course}
                              onChange={handleChange}
                              placeholder="Select course"
                              bg="white"
                              border="2px"
                              borderColor="gray.200"
                              _hover={{ borderColor: 'green.300' }}
                              _focus={{ 
                                borderColor: 'green.400',
                                boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                                bg: 'white'
                              }}
                              h="40px"
                            >
                              <option value="cit">CIT (Information Technology)</option>
                              <option value="coa">COA (Accountancy)</option>
                              <option value="coed">COED (Education)</option>
                              <option value="chm">CHM (Hospitality Management)</option>
                              <option value="cba">CBA (Business Administration)</option>
                            </Select>
                            {errors.course && <Text color="red.500" fontSize="xs">{errors.course[0]}</Text>}
                          </FormControl>
                          
                          <FormControl isInvalid={errors.year_level}>
                            <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                              Year Level
                            </FormLabel>
                            <Select
                              name="year_level"
                              value={formData.year_level}
                              onChange={handleChange}
                              placeholder="Year level"
                              bg="white"
                              border="2px"
                              borderColor="gray.200"
                              _hover={{ borderColor: 'green.300' }}
                              _focus={{ 
                                borderColor: 'green.400',
                                boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                                bg: 'white'
                              }}
                              h="40px"
                            >
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                            </Select>
                            {errors.year_level && <Text color="red.500" fontSize="xs">{errors.year_level[0]}</Text>}
                          </FormControl>
                        </HStack>
                      </>
                    )}

                    {/* Company Fields */}
                    {formData.role === 'company' && (
                      <>
                        <FormControl isInvalid={errors.company_name}>
                          <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                            Company Name
                          </FormLabel>
                          <Input
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            bg="white"
                            border="2px"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'green.300' }}
                            _focus={{ 
                              borderColor: 'green.400',
                              boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                              bg: 'white'
                            }}
                            h="40px"
                          />
                          {errors.company_name && <Text color="red.500" fontSize="xs">{errors.company_name[0]}</Text>}
                        </FormControl>
                        
                        <FormControl isInvalid={errors.company_address}>
                          <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                            Company Address
                          </FormLabel>
                          <Input
                            name="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            placeholder="Enter company address"
                            bg="white"
                            border="2px"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'green.300' }}
                            _focus={{ 
                              borderColor: 'green.400',
                              boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                              bg: 'white'
                            }}
                            h="40px"
                          />
                          {errors.company_address && <Text color="red.500" fontSize="xs">{errors.company_address[0]}</Text>}
                        </FormControl>
                        
                        <FormControl isInvalid={errors.company_description}>
                          <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                            Company Description
                          </FormLabel>
                          <Input
                            name="company_description"
                            value={formData.company_description}
                            onChange={handleChange}
                            placeholder="Brief company description"
                            bg="white"
                            border="2px"
                            borderColor="gray.200"
                            _hover={{ borderColor: 'green.300' }}
                            _focus={{ 
                              borderColor: 'green.400',
                              boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                              bg: 'white'
                            }}
                            h="40px"
                          />
                          {errors.company_description && <Text color="red.500" fontSize="xs">{errors.company_description[0]}</Text>}
                        </FormControl>
                      </>
                    )}

                    {/* Admin Fields - Minimal or none */}
                    {formData.role === 'admin' && (
                      <Alert 
                        status="info" 
                        borderRadius="md" 
                        fontSize="sm"
                        bg="blue.50"
                        border="1px"
                        borderColor="blue.200"
                      >
                        <AlertIcon />
                        Admin accounts may require additional verification after registration.
                      </Alert>
                    )}

                    {/* Password Fields - Fixed: Confirm password below */}
                    <FormControl isRequired isInvalid={errors.password}>
                      <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Min 6 characters"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                        />
                        <InputRightElement h="40px" pr={2}>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            color="gray.500"
                            _hover={{ bg: 'transparent', color: 'green.500' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && <Text color="red.500" fontSize="xs">{errors.password[0]}</Text>}
                    </FormControl>
                    
                    <FormControl isRequired isInvalid={errors.confirm_password}>
                      <FormLabel color="gray.700" fontSize="sm" fontWeight="medium">
                        Confirm Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="confirm_password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirm_password}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          bg="white"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'green.300' }}
                          _focus={{ 
                            borderColor: 'green.400',
                            boxShadow: '0 0 0 3px rgba(134, 239, 172, 0.3)',
                            bg: 'white'
                          }}
                          h="40px"
                        />
                        <InputRightElement h="40px" pr={2}>
                          <IconButton
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            icon={showConfirmPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            color="gray.500"
                            _hover={{ bg: 'transparent', color: 'green.500' }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.confirm_password && <Text color="red.500" fontSize="xs">{errors.confirm_password[0]}</Text>}
                    </FormControl>

                    <Button
                      type="submit"
                      bgGradient="linear(to-r, green.400, green.500)"
                      color="white"
                      size="md"
                      width="full"
                      isLoading={loading}
                      loadingText="Creating account..."
                      fontWeight="bold"
                      h="45px"
                      mt={4}
                      _hover={{
                        bgGradient: 'linear(to-r, green.500, green.600)',
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg'
                      }}
                      _active={{
                        transform: 'translateY(0)'
                      }}
                    >
                      Create Account
                    </Button>
                  </VStack>
                </form>

                <Box textAlign="center" pt={2}>
                  <Text color="gray.600" fontSize="sm">
                    Already have an account?{' '}
                    <Link
                      as={RouterLink}
                      to="/login"
                      color="green.600"
                      fontWeight="bold"
                      _hover={{ 
                        color: 'green.700', 
                        textDecoration: 'underline',
                        textUnderlineOffset: '2px'
                      }}
                    >
                      Login here
                    </Link>
                  </Text>
                </Box>
              </VStack>
            </Box>
          </Box>
        </HStack>
      </Box>
    </Flex>
  )
}

export default Register