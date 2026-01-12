// src/pages/Register.jsx
import React, { useState } from 'react'
import {
  Box, Container, Heading, FormControl, FormLabel, Input,
  Button, VStack, Text, Alert, AlertIcon, Radio, RadioGroup,
  Stack, Link, useToast, Select
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
      // Remove student-specific fields for companies
      cleanedData.student_id = null
      cleanedData.course = null
      cleanedData.year_level = null
  } else if (cleanedData.role === 'student') {
      // Remove company-specific fields for students
      cleanedData.company_name = null
      cleanedData.company_address = null
      cleanedData.company_description = null
  }
  
  // Convert empty strings to null for all fields
  Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '') {
          cleanedData[key] = null
      }
  })
  
  console.log("Cleaned data being sent:", cleanedData)  // for debugging
  
  const result = await register(cleanedData) 
  
  console.log("Registration result:", result)  // Add this

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
    <Container maxW="md" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={6}>
          <Heading size="lg">Create Account</Heading>
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
                {errors.username && <Text color="red.500" fontSize="sm">{errors.username[0]}</Text>}
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email[0]}</Text>}
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.role}>
                <FormLabel>I am a:</FormLabel>
                <RadioGroup 
                  name="role" 
                  value={formData.role} 
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                >
                  <Stack direction="row" spacing={5}>
                    <Radio value="student">Student</Radio>
                    <Radio value="company">Company</Radio>
                    <Radio value="admin">Admin</Radio>
                  </Stack>
                </RadioGroup>
                {errors.role && <Text color="red.500" fontSize="sm">{errors.role[0]}</Text>}
              </FormControl>
              
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </FormControl>
              
              {/* Student Fields */}
              {formData.role === 'student' && (
                <>
                  <FormControl>
                    <FormLabel>Student ID</FormLabel>
                    <Input
                      name="student_id"
                      value={formData.student_id}
                      onChange={handleChange}
                      placeholder="Enter student ID"
                    />
                  </FormControl>
                  
                  <FormControl isInvalid={errors.course}>
                    <FormLabel>Course</FormLabel>
                    <Select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Select course"
                    >
                      <option value="cit">CIT (Information Technology)</option>
                      <option value="coa">COA (Accountancy)</option>
                      <option value="coed">COED (Education)</option>
                      <option value="chm">CHM (Hospitality Management)</option>
                      <option value="cba">CBA (Business Administration)</option>
                    </Select>
                    {errors.course && <Text color="red.500" fontSize="sm">{errors.course[0]}</Text>}
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Year Level</FormLabel>
                    <Select
                      name="year_level"
                      value={formData.year_level}
                      onChange={handleChange}
                      placeholder="Select year level"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {/* Company Fields */}
              {formData.role === 'company' && (
                <>
                  <FormControl>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Enter company name"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Company Address</FormLabel>
                    <Input
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                      placeholder="Enter company address"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Company Description</FormLabel>
                    <Input
                      name="company_description"
                      value={formData.company_description}
                      onChange={handleChange}
                      placeholder="Brief company description"
                    />
                  </FormControl>
                </>
              )}
              
              <FormControl isRequired isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                />
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password[0]}</Text>}
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.confirm_password}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.confirm_password && <Text color="red.500" fontSize="sm">{errors.confirm_password[0]}</Text>}
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={loading}
                loadingText="Creating account..."
              >
                Register
              </Button>
            </VStack>
          </form>
          
          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="blue.500">
              Login here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}

export default Register